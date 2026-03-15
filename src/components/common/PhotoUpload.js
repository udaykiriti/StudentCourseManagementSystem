import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';

function PhotoUpload({ value, onChange, name = "photo" }) {
    const [preview, setPreview] = useState(value || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onChange(file, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null, null);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg">
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id={`photo-upload-${name}`}
            />

            <label
                htmlFor={`photo-upload-${name}`}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
                {preview ? 'Change Photo' : 'Upload Photo'}
            </label>

            <p className="mt-2 text-xs text-gray-500">
                Max size: 5MB • JPG, PNG
            </p>
        </div>
    );
}

export default PhotoUpload;
