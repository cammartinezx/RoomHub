import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/UserProfile.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faSnapchat, faFacebook, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const contactIcons = {
  instagram: faInstagram,
  snapchat: faSnapchat,
  facebook: faFacebook,
  discord: faDiscord,
  mobile: faPhone,
  email: faEnvelope,
};

const provincesAndCities = {
  Alberta: ['Calgary', 'Edmonton', 'Red Deer'],
  'British Columbia': ['Vancouver', 'Victoria', 'Kelowna'],
  Manitoba: ['Winnipeg', 'Brandon'],
  Ontario: ['Toronto', 'Ottawa', 'Mississauga'],
  Quebec: ['Montreal', 'Quebec City', 'Laval'],
  Saskatchewan: ['Regina', 'Saskatoon'],
};

const tagsList = [
  'Pet-Friendly 🐾',
  'Loves Outdoors 🌲',
  'Women-Only 🚺',
  'Non-Smoker 🚭',
  'Vegetarian/Vegan 🌱',
  'Early Riser 🌅',
  'Student-Friendly 🎓',
  'Night Owl 🌙',
  'Private 🚪',
  'Working Professional 💼',
  'LGBTQ+ Friendly 🏳️‍🌈',
  'Open to Guests 👥',
  'Eco-Conscious ♻️',
  'Fitness Enthusiast 🏋️',
  'Minimalist 🌿',
  'Creative-Friendly 🎨',
  'Remote Worker Friendly 💻',
  'Quiet 🤫',
  'Health-Conscious 🥗',
  'Tech-Savvy 📱',
  'Homebody 🏠',
  'Likes Cooking 🍲',
  'Kid-Friendly 🧒',
  'Quiet Hours ⏰',
  'Shares Groceries 🛒',
  'Long-Term 📅',
  'Social 👫',
  'Mindful of Utilities 💡',
  'Flexible with Pets 🐕',
  'Organized 🗂️',
  'Clean 🧼',
  'Short-Term Friendly 🗓️',
];


const contactBaseUrls = {
  instagram: 'https://www.instagram.com/',
  snapchat: 'https://www.snapchat.com/add/',
  facebook: 'https://www.facebook.com/',
  discord: 'https://discordapp.com/users/',
};


const UserProfile = ({signOut}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRoom = location.state?.hasRoom;
  const matchedUser = location.state?.matchedUser;
  const email = location.state?.email;

  const [profileData, setProfileData] = useState();
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const fetchProfile = async () =>{
      try {
        const userId = matchedUser || email;
        console.log("getting profile");
        const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/profile/${userId}/get-profile`);
        console.log(response.data.profile);
        const fetchedProfile = response.data.profile;
        setProfileData(fetchedProfile);

        console.log('SET PROFILE DATA');
        console.log(profileData);
        setLoading(false);
      }catch(error){
        console.log(error);
        if(error.response){
          switch(error.response.status) {
            case 422:
              alert('Oops! Looks like you do not have access to this profile');
              break
            case 404:
              alert('Oops! Looks like this profile no longer exists');
              break
            default:
              alert('An unexpected error occured. Try again later');
          }
        }
        else {
          alert('An unexpected error occured. Try again later');
        }
      };
    }
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfileData((prev) => {
      if (field === "province") {
        // Reset city and update province
        return { ...prev, province: value, city: "", location: "" };
      } else if (field === "city") {
        // Update city and set location to the new city
        return { ...prev, city: value, location: value };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };


  const handleTagSelection = (tag) => {
    setProfileData((prev) => {
      const { tags } = prev;
      if (tags.includes(tag)) {
        return { ...prev, tags: tags.filter((t) => t !== tag) };
      } else if (tags.length < 7) {
        return { ...prev, tags: [...tags, tag] };
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const updatedFields = {};
      for (const key in profileData) {
        if (profileData[key] !== originalData[key]) {
          updatedFields[key] = profileData[key];
        }
      }
  
      if (Object.keys(updatedFields).length === 0) {
        alert('No changes were made.');
        return;
      }
  
      if (updatedFields.tags) {
        // Update tags
        await axios.patch(
          `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/profile/${email}/update-tags`,
          { tags: updatedFields.tags }
        );
        delete updatedFields.tags;
      }
  
      if (Object.keys(updatedFields).length > 0) {
        // Map `contactType` to `contact_type` for backend compatibility
        if (updatedFields.contactType) {
          updatedFields.contact_type = updatedFields.contactType;
          delete updatedFields.contactType; // Remove the frontend key
        }

        console.log("Payload being sent to update-profile:", updatedFields);
        await axios.patch(
          `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/profile/${email}/update-profile`,
          updatedFields
        );
      }
  
      // Fetch updated profile data
      const response = await axios.get(
        `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/profile/${email}/get-profile`
      );
      setProfileData(response.data.profile);
      setOriginalData(response.data.profile);
      window.location.reload()
  
      alert('Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleContactClick = () => {
    if (!profileData.contact_type || !profileData.contact) return;

    const message = encodeURIComponent('Hey, we matched on RoomHub');
    let url;

    switch (profileData.contact_type.toLowerCase()) {
      case 'instagram':
        url = `${contactBaseUrls.instagram}${profileData.contact}`;
        break;
      case 'snapchat':
        url = `${contactBaseUrls.snapchat}${profileData.contact}`;
        break;
      case 'facebook':
        url = `${contactBaseUrls.facebook}${profileData.contact}`;
        break;
      case 'discord':
        url = `${contactBaseUrls.discord}${profileData.contact}`;
        break;
      case 'email':
        url = `mailto:${profileData.contact}?subject=RoomHub Match&body=${message}`;
        break;
      case 'mobile':
        url = `sms:${profileData.contact}?body=${message}`;
        break;
      default:
        alert('Unsupported contact type.');
        return;
    }

    window.open(url, '_blank');
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSignout = async () => {
    try {
      await signOut({ global: true });
      // Redirect to landing page after successful logout
      navigate('/');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <div className={styles.userProfileContainer}>
      <header className={styles.userProfileHeader}>
        <div className={styles.userProfileLogo}>
          <img
            src="/logo2.png"
            alt="RoomHub Logo"
            onClick={() => navigate('/home')}
          />
        </div>
      </header>

      <div className={styles.userProfileContent}>
        <h1 className={styles.userProfileTitle}>{profileData.name.toUpperCase()}</h1>

        {!isEditing ? (
          <div className={styles.userProfileDetails}>
            <p><strong>Age:</strong> {new Date().getFullYear() - new Date(profileData.dob).getFullYear()}</p>
            <p><strong>Gender:</strong> {profileData.gender}</p>
            <p><strong>Location:</strong> {profileData.location}</p>
            <p><strong>Bio:</strong> {profileData.bio}</p>
            <p>
              <strong>Contact Info:</strong>
              {profileData.contact_type && (
                <span
                  onClick={handleContactClick}
                  className={styles.clickableContact}
                >
                  <FontAwesomeIcon icon={contactIcons[profileData.contact_type]} style={{ fontSize: '1.5rem', marginRight: '10px', marginLeft: '10px' }} />
                  {profileData.contact}
                </span>
              )}
            </p>
            <div>
              <div className={styles.userProfileTags}>
                {profileData.tags.map((tag) => (
                  <span key={tag} className={styles.userProfileTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {!matchedUser && (
              <button
                className={`${styles.userProfileButton} ${styles.userProfileEditButton}`}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
            {!matchedUser && (
              <button
                className={`${styles.incompleteProfileButton} ${styles.incompleteProfileLogoutButton}`}
                onClick={handleSignout}>
                  Log Out
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.userProfileForm}>
            <label>
              Name:
              <input
                type="text"
                value={profileData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </label>

            <label>
              Date of Birth:
              <input
                type="date"
                value={profileData.dob || ""}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </label>

            <label>
              Gender:
              <select
                value={profileData.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </label>

            <label>
              Province:
              <select
                value={profileData.province || ""}
                onChange={(e) => handleChange("province", e.target.value)}
              >
                <option value="">Select Province</option>
                {Object.keys(provincesAndCities).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </label>

            <label>
              City:
              <select
                value={profileData.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={!profileData.province}
              >
                <option value="">Select City</option>
                {provincesAndCities[profileData.province]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Bio:
              <textarea
                value={profileData.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows="4"
                placeholder="Tell us about yourself"
              />
            </label>

            <label>
              Tags (Select 3-7):
              <div className={styles.tagsContainer}>
                {tagsList.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`${styles.tagButton} ${
                      profileData.tags?.includes(tag) ? styles.selected : ""
                    }`}
                    onClick={() => handleTagSelection(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </label>

            <label>
              Contact Type:
              <select
                value={profileData.contactType || ""}
                onChange={(e) => handleChange("contactType", e.target.value)}
              >
                <option value="">Select Contact Type</option>
                <option value="Mobile">Mobile</option>
                <option value="Email">Email</option>
                <option value="Instagram">Instagram</option>
                <option value="Snapchat">Snapchat</option>
                <option value="Facebook">Facebook</option>
                <option value="Discord">Discord</option>
                <option value="Other">Other</option>
              </select>
            </label>

            {profileData.contactType && (
              <label>
                {profileData.contactType}:
                <input
                  type="text"
                  value={profileData.contact || ""}
                  onChange={(e) => handleChange("contact", e.target.value)}
                />
              </label>
            )}

            <button type="submit" className={`${styles.userProfileButton} ${styles.saveButton}`}>
              Save Changes
            </button>
            <button
              type="button"
              className={`${styles.userProfileButton} ${styles.cancelButton}`}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        )}

        <button
          className={`${styles.userProfileButton} ${styles.userProfileBackButton}`}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
