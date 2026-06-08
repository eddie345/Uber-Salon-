import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import {
  IconChevronLeft,
  IconPlus,
  IconX,
  IconCheck,
  IconScissors,
  IconStar
} from '@tabler/icons-react';

// Ghana-specific barber and hair stylist skills
const GHANA_BARBER_SKILLS = [
  "Fade Cuts",
  "Beard Trimming",
  "Line-ups",
  "Hot Towel Shave",
  "Classic Haircuts",
  "Razor Finish",
  "Hair Design",
  "Grooming Services",
  "Buzz Cuts",
  "Hair Lineups",
  "Beard Shaving",
  "Children's Haircuts",
  "Clipper Cuts",
  "Clean Shaves",
  "Beard Dyeing",
  "Fade Techniques",
  "Executive Haircuts",
  "Hair Coloring",
  "Highlights",
  "Beard Styling",
  "Facial Massage",
  "Premium Cuts",
  "Hair Dyeing",
  "Luxury Grooming"
];

const GHANA_HAIRSTYLIST_SKILLS = [
  "Box Braids",
  "Ghana Weaving",
  "Cornrows",
  "Hair Relaxing",
  "Natural Hair Styling",
  "Braiding Techniques",
  "Hair Treatment",
  "Protective Styles",
  "Sisterlocks Installation",
  "Loc Retwist",
  "Dreadlocks Repair",
  "Loc Maintenance",
  "Crochet Method",
  "Hair Locking",
  "Natural Hair Care",
  "Loc Styling",
  "Weave Sew-ins",
  "Wig Customization",
  "Deep Conditioning",
  "Wig Installation",
  "Steam Therapy",
  "Natural Hair Twists",
  "Knotless Braids",
  "Finger Coils",
  "Double-strand Twists",
  "Hair Moisturizing"
];

export const ArtisanProfileSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [specialty, setSpecialty] = useState<'barber' | 'hairdresser'>('barber');
  const [services, setServices] = useState([
    { name: '', duration: '', price: '', description: '' }
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!user || user.role !== 'artisan') return null;

  const availableSkills = specialty === 'barber' ? GHANA_BARBER_SKILLS : GHANA_HAIRSTYLIST_SKILLS;

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const addService = () => {
    setServices([...services, { name: '', duration: '', price: '', description: '' }]);
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20 pt-6">
      <div className="max-width-container max-w-[800px]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-dark hover:bg-gray-50 transition"
          >
            <IconChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[24px] font-heading font-extrabold text-dark leading-tight">
              Business Profile Settings
            </h1>
            <p className="text-[14px] text-muted font-medium mt-1">
              Manage your skills and services for clients in Ghana
            </p>
          </div>
        </div>

        {/* Specialty Selection */}
        <Card className="p-6 mb-6">
          <h2 className="text-[18px] font-bold text-dark mb-4 flex items-center gap-2">
            <IconScissors className="w-5 h-5 text-primary" />
            Your Specialty
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setSpecialty('barber');
                setSelectedSkills([]);
              }}
              className={`p-4 rounded-xl border-2 transition-all ${
                specialty === 'barber'
                  ? 'border-primary bg-[#E6F3EC]'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-[16px] font-bold text-dark mb-1">Barber</div>
              <div className="text-[12px] text-muted">Haircuts, fades, beard grooming</div>
            </button>
            <button
              onClick={() => {
                setSpecialty('hairdresser');
                setSelectedSkills([]);
              }}
              className={`p-4 rounded-xl border-2 transition-all ${
                specialty === 'hairdresser'
                  ? 'border-primary bg-[#E6F3EC]'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-[16px] font-bold text-dark mb-1">Hair Stylist</div>
              <div className="text-[12px] text-muted">Braids, weaves, natural hair</div>
            </button>
          </div>
        </Card>

        {/* Skills Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-[18px] font-bold text-dark mb-4 flex items-center gap-2">
            <IconStar className="w-5 h-5 text-primary" />
            Your Skills
          </h2>
          <p className="text-[14px] text-muted font-medium mb-4">
            Select all skills you offer. These will be displayed to clients across Ghana.
          </p>

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary bg-[#E6F3EC] px-3 py-1.5 rounded-lg"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-dark transition"
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Available Skills Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {availableSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`text-[12px] font-semibold px-3 py-2 rounded-lg transition-all ${
                  selectedSkills.includes(skill)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-dark hover:bg-gray-200'
                }`}
              >
                {selectedSkills.includes(skill) && (
                  <IconCheck className="w-3 h-3 inline mr-1" />
                )}
                {skill}
              </button>
            ))}
          </div>

          {/* Custom Skill Input */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Add custom skill..."
              className="flex-1 h-[44px] px-4 rounded-lg border border-gray-200 text-[14px] font-medium focus:outline-none focus:border-primary"
            />
            <button
              onClick={addCustomSkill}
              className="h-[44px] px-4 bg-primary text-white rounded-lg font-bold hover:bg-[#005230] transition flex items-center gap-2"
            >
              <IconPlus className="w-4 h-4" />
              Add
            </button>
          </div>
        </Card>

        {/* Services Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-[18px] font-bold text-dark mb-4 flex items-center gap-2">
            <IconScissors className="w-5 h-5 text-primary" />
            Your Services
          </h2>
          <p className="text-[14px] text-muted font-medium mb-4">
            Add the specific services you offer with pricing in Ghana Cedis (GHS).
          </p>

          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[13px] font-bold text-primary">Service {index + 1}</span>
                  {services.length > 1 && (
                    <button
                      onClick={() => removeService(index)}
                      className="text-danger hover:text-red-700 transition"
                    >
                      <IconX className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateService(index, 'name', e.target.value)}
                    placeholder="Service name (e.g., Premium Fade)"
                    className="h-[44px] px-4 rounded-lg border border-gray-200 text-[14px] font-medium focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={service.duration}
                    onChange={(e) => updateService(index, 'duration', e.target.value)}
                    placeholder="Duration (e.g., 30 mins)"
                    className="h-[44px] px-4 rounded-lg border border-gray-200 text-[14px] font-medium focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={service.price}
                    onChange={(e) => updateService(index, 'price', e.target.value)}
                    placeholder="Price (e.g., 50 GHS)"
                    className="h-[44px] px-4 rounded-lg border border-gray-200 text-[14px] font-medium focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    placeholder="Brief description"
                    className="h-[44px] px-4 rounded-lg border border-gray-200 text-[14px] font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addService}
            className="mt-4 w-full h-[44px] border-2 border-dashed border-gray-300 rounded-lg text-muted font-bold hover:border-primary hover:text-primary transition flex items-center justify-center gap-2"
          >
            <IconPlus className="w-4 h-4" />
            Add Another Service
          </button>
        </Card>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full h-[56px] bg-primary text-white text-[16px] font-bold rounded-xl hover:bg-[#005230] transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <IconCheck className="w-5 h-5" />
          Save Profile Changes
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed bottom-24 left-4 right-4 bg-green-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-center gap-2 animate-scaleUp">
            <IconCheck className="w-5 h-5" />
            <span className="font-bold">Profile updated successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanProfileSettingsPage;
