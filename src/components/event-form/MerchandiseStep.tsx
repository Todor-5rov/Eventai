import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { EventFormData } from '@/app/dashboard/organizer/create-event/page';
import { supabase } from '@/lib/supabase';
import { Partner } from '@/types/database';

interface MerchandiseStepProps {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 3;

export function MerchandiseStep({ formData, updateFormData, onNext, onBack }: MerchandiseStepProps) {
  const [merchandisePartners, setMerchandisePartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadPartners() {
      if (formData.needsMerchandise) {
        const { data } = await supabase
          .from('partners')
          .select('*')
          .eq('service_type', 'merchandise')
          .eq('city', formData.city);

        if (data) {
          setMerchandisePartners(data);
        }
      }
      setIsLoading(false);
    }

    loadPartners();
  }, [formData.city, formData.needsMerchandise]);

  async function handleFileDrop(acceptedFiles: File[]) {
    setUploadError('');

    // Validate file count
    if (formData.files.length + acceptedFiles.length > MAX_FILES) {
      setUploadError(`You can only upload up to ${MAX_FILES} files`);
      return;
    }

    // Validate file sizes
    for (const file of acceptedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File ${file.name} is too large. Maximum size is 5MB`);
        return;
      }
    }

    setIsUploading(true);

    try {
      const uploadedFiles = [];

      for (const file of acceptedFiles) {
        // Upload to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('event-files')
          .upload(fileName, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('event-files')
          .getPublicUrl(fileName);

        uploadedFiles.push({
          name: file.name,
          url: publicUrl,
          size: file.size,
          mimeType: file.type,
        });
      }

      updateFormData({
        files: [...formData.files, ...uploadedFiles]
      });
    } catch (error) {
      setUploadError('Failed to upload files. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }

  function removeFile(index: number) {
    updateFormData({
      files: formData.files.filter((_, i) => i !== index)
    });
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
    },
    disabled: isUploading || formData.files.length >= MAX_FILES,
  });

  function togglePartner(partnerId: string) {
    const selected = formData.selectedMerchandise.includes(partnerId);
    if (selected) {
      updateFormData({
        selectedMerchandise: formData.selectedMerchandise.filter(id => id !== partnerId)
      });
    } else {
      updateFormData({
        selectedMerchandise: [...formData.selectedMerchandise, partnerId]
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Merchandise & Printing</h2>
        <p className="text-gray-600">Do you need merchandise or printing services?</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="radio"
            checked={formData.needsMerchandise === false}
            onChange={() => updateFormData({ 
              needsMerchandise: false, 
              selectedMerchandise: [],
              files: []
            })}
            className="mr-2"
          />
          <span>No, I don't need merchandise</span>
        </label>

        <label className="flex items-center">
          <input
            type="radio"
            checked={formData.needsMerchandise === true}
            onChange={() => updateFormData({ needsMerchandise: true })}
            className="mr-2"
          />
          <span>Yes, I need merchandise/printing</span>
        </label>
      </div>

      {formData.needsMerchandise && (
        <>
          {isLoading ? (
            <div className="text-center py-8">Loading partners...</div>
          ) : merchandisePartners.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                No merchandise/printing companies found in {formData.city}.
              </p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              <p className="font-medium">Select companies:</p>
              {merchandisePartners.map((partner) => (
                <label
                  key={partner.id}
                  className={`
                    flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors
                    ${formData.selectedMerchandise.includes(partner.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedMerchandise.includes(partner.id)}
                    onChange={() => togglePartner(partner.id)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{partner.company_name}</h3>
                    {partner.description && (
                      <p className="text-sm text-gray-600 mt-1">{partner.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Contact: {partner.contact_name} ({partner.contact_email})
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* File Upload Section */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Upload Files (Logos, Designs, etc.)</h3>
            
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
                ${isUploading || formData.files.length >= MAX_FILES ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              <div className="text-4xl mb-2">📎</div>
              {isUploading ? (
                <p className="text-gray-600">Uploading...</p>
              ) : formData.files.length >= MAX_FILES ? (
                <p className="text-gray-600">Maximum files uploaded</p>
              ) : isDragActive ? (
                <p className="text-primary-600">Drop files here...</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-1">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-xs text-gray-500">
                    Max {MAX_FILES} files, 5MB each. Images and PDFs only.
                  </p>
                </>
              )}
            </div>

            {uploadError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-2">
                {uploadError}
              </div>
            )}

            {formData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-medium text-sm">Uploaded Files:</p>
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📄</span>
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn btn-secondary">
          Back
        </button>
        <button type="button" onClick={onNext} className="btn btn-primary">
          Next: Sponsors
        </button>
      </div>
    </div>
  );
}

