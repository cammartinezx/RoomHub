import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/WelcomeFindRoommate.module.css';

const provincesAndCities = {
  "Alberta": ["Calgary", "Edmonton", "Red Deer"],
  "British Columbia": ["Vancouver", "Victoria", "Kelowna"],
  "Manitoba": ["Winnipeg", "Brandon"],
  "Ontario": ["Toronto", "Ottawa", "Mississauga"],
  "Quebec": ["Montreal", "Quebec City", "Laval"],
  "Saskatchewan": ["Regina", "Saskatoon"],
};

const tagsList = [
  "Pet-Friendly 🐾",
  "Loves Outdoors 🌲",
  "Women-Only 🚺",
  "Non-Smoker 🚭",
  "Vegetarian/Vegan 🌱",
  "Early Riser 🌅",
  "Student-Friendly 🎓",
  "Night Owl 🌙",
  "Private 🚪",
  "Working Professional 💼",
  "LGBTQ+ Friendly 🏳️‍🌈",
  "Open to Guests 👥",
  "Eco-Conscious ♻️",
  "Fitness Enthusiast 🏋️",
  "Minimalist 🌿",
  "Creative-Friendly 🎨",
  "Remote Worker Friendly 💻",
  "Quiet 🤫",
  "Health-Conscious 🥗",
  "Tech-Savvy 📱",
  "Homebody 🏠",
  "Likes Cooking 🍲",
  "Kid-Friendly 🧒",
  "Quiet Hours ⏰",
  "Shares Groceries 🛒",
  "Long-Term 📅",
  "Social 👫",
  "Mindful of Utilities 💡",
  "Flexible with Pets 🐕",
  "Organized 🗂️",
  "Clean 🧼",
  "Short-Term Friendly 🗓️",
];

const WelcomeFindRoommate = () => {
  const [step, setStep] = useState(0); // Step 0 for the welcome message
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    province: "",
    city: "",
    bio: "",
    tags: [],
    contactType: "",
    contact: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const hasRoom = location.state?.hasRoom;
  const email = location.state?.email;

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
      return prev; // Do nothing if max tags are selected
    });
  };

  const handleNextStep = () => {
    if (step === 5) {
      // Submit profile data
      console.log("Submitting profile data:", profileData);
      navigate('/find-roommate', { state: {email, hasRoom} } );
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  return (
    <div className={styles.welcomeContainer}>
      {step === 0 && (
        <div className={styles.welcomeStep}>
          <h2>Welcome to Find My Roommate!</h2>
          <p>
            We're excited to help you find the perfect roommate. To get started, we'll need a bit of information about you.
            This will help us match you with people who share similar preferences and interests.
          </p>
          <button onClick={handleNextStep} className={styles.startButton}>
            Get Started
          </button>
        </div>
      )}

      {step === 1 && (
        <div className={styles.formStep}>
          <h2>Step 1: Personal Details</h2>
          <label>
            First Name:
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              value={profileData.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              required
            />
          </label>
          <label>
            Gender:
            <select
              value={profileData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
            </select>
          </label>
          <div className={styles.navigationButtons}>
            <button onClick={handlePreviousStep} className={styles.navButton}>
              Back
            </button>
            <button 
            onClick={handleNextStep} 
            className={styles.navButton}
            disabled={
              !profileData.firstName || !profileData.lastName || !profileData.dob || !profileData.gender
            }>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.formStep}>
          <h2>Step 2: Location</h2>
          <label>
            Province:
            <select
              value={profileData.province}
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
              value={profileData.city}
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
          <div className={styles.navigationButtons}>
            <button onClick={handlePreviousStep} className={styles.navButton}>
              Back
            </button>
            <button onClick={handleNextStep} className={styles.navButton} 
            disabled={!profileData.province || !profileData.city}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.formStep}>
          <h2>Step 3: About You</h2>
          <label>
            Bio:
            <textarea
              value={profileData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell us about yourself!"
            />
          </label>
          <div className={styles.navigationButtons}>
            <button onClick={handlePreviousStep} className={styles.navButton}>
              Back
            </button>
            <button onClick={handleNextStep} className={styles.navButton}
            disabled={!profileData.bio}>
              Next
            </button>
          </div>
        </div>
      )}

    {step === 4 && (
      <div className={styles.step}>
        <h2 className={styles.stepTitle}>Step 4: Tags</h2>
        <p className={styles.stepDescription}>
          Select 3-7 tags that best describe you:
        </p>
        <div className={styles.tagsContainerStep4}>
          {tagsList.map((tag) => (
            <button
              key={tag}
              className={`${styles.tagButtonStep4} ${
                profileData.tags.includes(tag) ? styles.selected : ""
              }`}
              onClick={() => handleTagSelection(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <p className={styles.tagCounter}>{profileData.tags.length}/7 tags selected</p>
        <div className={styles.navigationButtons}>
          <button onClick={handlePreviousStep} className={styles.navButton}>
            Back
          </button>
          <button
            onClick={handleNextStep}
            className={styles.navButton}
            disabled={profileData.tags.length < 3}
          >
            Next
          </button>
        </div>
      </div>
    )}


      {step === 5 && (
        <div className={styles.formStep}>
          <h2>Step 5: Contact Information</h2>
          <label>
            Preferred Contact Type:
            <select
              value={profileData.contactType}
              onChange={(e) => handleChange("contactType", e.target.value)}
            >
              <option value="">Select Contact Type</option>
              <option value="Mobile">Mobile</option>
              <option value="Social Media">Social Media</option>
              <option value="Email">Email</option>
            </select>
          </label>
          {profileData.contactType && (
            <label>
              {profileData.contactType}:
              <input
                type="text"
                value={profileData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
              />
            </label>
          )}
          <div className={styles.navigationButtons}>
            <button onClick={handlePreviousStep} className={styles.navButton}>
              Back
            </button>
            <button onClick={handleNextStep} className={styles.navButton}
            disabled={!profileData.contact}>
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeFindRoommate;
