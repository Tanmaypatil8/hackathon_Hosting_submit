import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHostProfile, updateHostProfile } from '../api';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import Modal from 'react-modal';
import 'react-image-crop/dist/ReactCrop.css';

export default function EditHostProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    profession: '',
    bio: '',
    collegeOrCompany: '',
    domain: '',
    achievements: [],
    location: '',
    socialLinks: {
      linkedin: '',
      github: '',
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

  // Add this helper function to ensure social links object structure
  const initializeSocialLinks = (data) => {
    const defaultLinks = {
      linkedin: '',
      github: '',
      twitter: ''
    };

    if (!data?.socialLinks) return defaultLinks;

    try {
      const parsed = typeof data.socialLinks === 'string' 
        ? JSON.parse(data.socialLinks) 
        : data.socialLinks;
      
      return {
        linkedin: parsed.linkedin || '',
        github: parsed.github || '',
        twitter: parsed.twitter || ''
      };
    } catch {
      return defaultLinks;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getHostProfile();
        if (data && !data.error) {
          setForm({
            profession: data.hostProfile?.profession || '',
            bio: data.hostProfile?.bio || '',
            collegeOrCompany: data.hostProfile?.collegeOrCompany || '',
            domain: data.hostProfile?.domain || '',
            achievements: data.hostProfile?.achievements ? 
              JSON.parse(data.hostProfile.achievements) : [],
            location: data.hostProfile?.location || '',
            socialLinks: initializeSocialLinks(data.hostProfile)
          });
          setPreviewUrl(data.hostProfile?.profilePicUrl || '');
        }
      } catch (err) {
        setError('Failed to fetch profile data');
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const onSelectFile = (e) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setTempImage(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = async () => {
    try {
      if (!imgRef.current || !crop.width || !crop.height) return;

      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas dimensions to match the cropped area
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      // Draw the cropped image
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

      // Convert to blob with proper type
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return;
        }
        
        // Create file and update state
        const croppedFile = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
        const previewUrl = URL.createObjectURL(blob);
        
        setProfilePic(croppedFile);
        setPreviewUrl(previewUrl);
        setShowCropModal(false);
      }, 'image/jpeg', 1);

    } catch (error) {
      console.error('Error cropping image:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const formattedData = {
        ...form,
        achievements: JSON.stringify(form.achievements),
        socialLinks: JSON.stringify(form.socialLinks)
      };

      formData.append('data', JSON.stringify(formattedData));
      await updateHostProfile(formData);
      navigate('/profile');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Add this section before the form */}
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

      {/* Image Crop Modal */}
      <Modal
        isOpen={showCropModal}
        onRequestClose={() => setShowCropModal(false)}
        className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
        ariaHideApp={false}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Crop Profile Picture</h3>
          {tempImage && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCrop(c)}
              aspect={1}
              circularCrop
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
              type="button"
              onClick={() => setShowCropModal(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onCropComplete}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      <h1 className="text-2xl font-bold mb-6">Host Profile Information</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Profession*</label>
            <input
              type="text"
              value={form.profession}
              onChange={e => setForm({...form, profession: e.target.value})}
              className="w-full rounded-md border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">College/Company*</label>
            <input
              type="text"
              value={form.collegeOrCompany}
              onChange={e => setForm({...form, collegeOrCompany: e.target.value})}
              className="w-full rounded-md border p-2"
              required
            />
          </div>
        </div>

        {/* Bio */}
        <div>
         
          <textarea
            value={form.bio}
            onChange={e => setForm({...form, bio: e.target.value})}
            rows={3}
            className="w-full rounded-md border p-2"
          />
        </div>

        {/* Domain and Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Domain*</label>
            <input
              type="text"
              value={form.domain}
              onChange={e => setForm({...form, domain: e.target.value})}
              className="w-full rounded-md border p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location*</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              className="w-full rounded-md border p-2"
              required
            />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium mb-2">Social Links</label>
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-600">LinkedIn</label>
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={form.socialLinks.linkedin}
                onChange={e => setForm({
                  ...form,
                  socialLinks: {
                    ...form.socialLinks,
                    linkedin: e.target.value
                  }
                })}
                className="w-full rounded-md border p-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">GitHub</label>
              <input
                type="url"
                placeholder="GitHub URL"
                value={form.socialLinks.github}
                onChange={e => setForm({
                  ...form,
                  socialLinks: {
                    ...form.socialLinks,
                    github: e.target.value
                  }
                })}
                className="w-full rounded-md border p-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Twitter</label>
              <input
                type="url"
                placeholder="Twitter URL"
                value={form.socialLinks.twitter}
                onChange={e => setForm({
                  ...form,
                  socialLinks: {
                    ...form.socialLinks,
                    twitter: e.target.value
                  }
                })}
                className="w-full rounded-md border p-2 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}