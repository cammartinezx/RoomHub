import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/UserProfile.module.css';
import axios from 'axios';

const mockProfileData = {
  name: 'John Doe',
  dob: '1995-08-15',
  gender: 'Male',
  province: 'Ontario',
  city: 'Toronto',
  bio: 'I am a software engineer who loves coding and hiking.',
  tags: ['Pet-Friendly 🐾', 'Non-Smoker 🚭', 'Fitness Enthusiast 🏋️'],
  contactType: 'Email',
  contact: 'johndoe@example.com',
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
const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRoom = location.state?.hasRoom;
  const email = location.state?.email;

  const [profileData, setProfileData] = useState(mockProfileData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() =>{
    const fetchProfile = async () =>{
      try {
        const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/profile/${email}/get-profile`);
        console.log(response.data.profile);
        const fetchedProfile = response.data.profile;
        setProfileData(fetchedProfile);

        console.log(profileData);
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
  }, [email]);

  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('Profile updated successfully!');
    console.log('Updated Profile Data:', profileData);
  };

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
        <h1 className={styles.userProfileTitle}>User Profile for {profileData.name}</h1>

        {!isEditing ? (
          <div className={styles.userProfileDetails}>
            <p><strong>Age:</strong> {new Date().getFullYear() - new Date(profileData.dob).getFullYear()}</p>
            <p><strong>Gender:</strong> {profileData.gender}</p>
            <p><strong>Location:</strong> {profileData.location}</p>
            <p><strong>Bio:</strong> {profileData.bio}</p>
            <p>
              <strong>Contact:</strong>{' '}
              {profileData.contact_type
                ? `${profileData.contact_type}: ${profileData.contact}`
                : 'Not provided'}
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

            <button
              className={`${styles.userProfileButton} ${styles.userProfileEditButton}`}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.userProfileForm}>
            <label>
              Name:
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </label>

            <label>
              Date of Birth:
              <input
                type="date"
                value={profileData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                required
              />
            </label>

            <label>
              Gender:
              <select
                value={profileData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
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
                value={profileData.province}
                onChange={(e) => handleChange('province', e.target.value)}
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
                value={profileData.city}
                onChange={(e) => handleChange('city', e.target.value)}
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
                value={profileData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
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
                    className={`${styles.tagButton} ${
                      profileData.tags.includes(tag) ? styles.selected : ''
                    }`}
                    type="button"
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
                value={profileData.contactType}
                onChange={(e) => handleChange('contactType', e.target.value)}
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
                  value={profileData.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                />
              </label>
            )}

            <button
              type="submit"
              className={`${styles.userProfileButton} ${styles.userProfileUpdateButton}`}
            >
              Save Changes
            </button>
            <button
              type="button"
              className={`${styles.userProfileButton} ${styles.userProfileCancelButton}`}
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
