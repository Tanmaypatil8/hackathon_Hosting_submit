import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../api';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import Modal from 'react-modal';
import 'react-image-crop/dist/ReactCrop.css';

export default function EditUserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    location: '',
    education: '',
    studyYear: '',
    collegeName: '',
    courseName: '',
    skills: '',
    profession: '',
    bio: '',
    dateOfBirth: '',
    domain: '',
    achievements: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: ''
    }
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
    aspect: 1
  });
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const imgRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        if (data && !data.error) {
          setForm({
            location: data.profile?.location || '',
            education: data.profile?.education || '',
            studyYear: data.profile?.studyYear || '',
            collegeName: data.profile?.collegeName || '',
            courseName: data.profile?.courseName || '',
            skills: Array.isArray(data.profile?.skills) ? data.profile.skills.join(', ') : '',
            profession: data.profile?.profession || '',
            bio: data.profile?.bio || '',
            dateOfBirth: data.profile?.dateOfBirth ? new Date(data.profile.dateOfBirth).toISOString().split('T')[0] : '',
            domain: data.profile?.domain || '',
            achievements: Array.isArray(data.profile?.achievements) ? data.profile.achievements.join('\n') : '',
            socialLinks: data.profile?.socialLinks ? JSON.parse(data.profile.socialLinks) : {
              github: '',
              linkedin: '',
              twitter: ''
            }
          });
        }
      } catch (err) {
        setError('Failed to fetch profile data. Please try again later.');
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImage(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = async (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(imgRef.current, crop);
      const file = await fetch(croppedImageUrl).then(r => r.blob());
      const croppedFile = new File([file], "profile.jpg", { type: 'image/jpeg' });
      setProfilePic(croppedFile);
      setPreviewUrl(croppedImageUrl);
      setShowCropModal(false);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(URL.createObjectURL(blob));
        },
        'image/jpeg',
        1
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add profile picture if selected
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      // Add other form data
      const formattedData = {
        ...form,
        skills: form.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        achievements: form.achievements.split('\n').filter(Boolean),
        socialLinks: JSON.stringify(form.socialLinks),
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : null
      };

      // Append formatted data
      formData.append('data', JSON.stringify(formattedData));

      await updateUserProfile(formData);
      navigate('/profile');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
          height: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6" id="profile-title">Additional Information</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="hidden"
            id="profilePic"
          />
          <label
            htmlFor="profilePic"
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload Photo
          </label>
        </div>

        {/* Crop Modal */}
        <Modal
          isOpen={showCropModal}
          onRequestClose={() => setShowCropModal(false)}
          className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Crop Profile Picture</h3>
            {tempImage && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
                circularCrop
                keepSelection
              >
                <img
                  ref={imgRef}
                  src={tempImage}
                  alt="Crop preview"
                  className="max-w-full"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => onCropComplete(crop)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="education" className="block text-sm font-medium mb-1">Education Level*</label>
            <select
              id="education"
              value={form.education}
              onChange={e => setForm({...form, education: e.target.value})}
              className="w-full rounded-md border p-2"
              required
              aria-required="true"
            >
              <option value="">Select Education</option>
              <option value="High School">High School</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <div>
            <label htmlFor="studyYear" className="block text-sm font-medium mb-1">Study Year*</label>
            <select
              id="studyYear"
              value={form.studyYear}
              onChange={e => setForm({...form, studyYear: e.target.value})}
              className="w-full rounded-md border p-2"
              required
              aria-required="true"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
              <option value="Final">Final Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="collegeName" className="block text-sm font-medium mb-1">College Name*</label>
            <input
              id="collegeName"
              type="text"
              value={form.collegeName}
              onChange={e => setForm({...form, collegeName: e.target.value})}
              className="w-full rounded-md border p-2"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium mb-1">Course Name*</label>
            <input
              id="courseName"
              type="text"
              value={form.courseName}
              onChange={e => setForm({...form, courseName: e.target.value})}
              className="w-full rounded-md border p-2"
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={e => setForm({...form, dateOfBirth: e.target.value})}
              className="w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              className="w-full rounded-md border p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="profession" className="block text-sm font-medium mb-1">Profession</label>
            <input
              id="profession"
              type="text"
              value={form.profession}
              onChange={e => setForm({...form, profession: e.target.value})}
              className="w-full rounded-md border p-2"
            />
          </div>
          <div>
            <label htmlFor="domain" className="block text-sm font-medium mb-1">Domain</label>
            <input
              id="domain"
              type="text"
              value={form.domain}
              onChange={e => setForm({...form, domain: e.target.value})}
              className="w-full rounded-md border p-2"
              placeholder="e.g., Web Development, AI/ML"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm({...form, bio: e.target.value})}
            rows={3}
            className="w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
          <input
            type="text"
            value={form.skills}
            onChange={e => setForm({...form, skills: e.target.value})}
            className="w-full rounded-md border p-2"
            placeholder="e.g., JavaScript, React, Node.js"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Achievements (one per line)</label>
          <textarea
            value={form.achievements}
            onChange={e => setForm({...form, achievements: e.target.value})}
            rows={4}
            className="w-full rounded-md border p-2"
            placeholder="Enter each achievement on a new line"
          />
        </div>

        <div role="group" aria-labelledby="social-links-title">
          <h3 id="social-links-title" className="block text-sm font-medium mb-2">Social Links</h3>
          {Object.entries(form.socialLinks).map(([platform, url]) => (
            <div key={platform} className="mb-2">
              <label htmlFor={`social-${platform}`} className="sr-only">{platform} URL</label>
              <input
                id={`social-${platform}`}
                type="url"
                placeholder={`${platform} URL`}
                value={url}
                onChange={e => setForm({
                  ...form,
                  socialLinks: {
                    ...form.socialLinks,
                    [platform]: e.target.value
                  }
                })}
                className="w-full rounded-md border p-2"
                aria-label={`${platform} profile URL`}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-4 py-2 border rounded"
            aria-label="Cancel profile editing"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            aria-label="Save profile changes"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

async function getCroppedImg(image, crop, fileName) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imageObj = await new Promise((resolve) => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      resolve(img);
    };
  });

  const pixelCrop = {
    x: crop.x,
    y: crop.y,
    width: crop.width,
    height: crop.height
  };

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    imageObj,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg');
  });
}