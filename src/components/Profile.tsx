import { LogOut, MapPin, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useProfile } from "../data/hooks/ProfileHook";

export default function Profile() {
  const {
    profile,
    loading,
    error,
    isEditing,
    formData,
    setFormData,
    setIsEditing,
    handleSubmit,
    handleSignOut,
  } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Profile</h2>
            <div className="flex items-center space-x-4">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="locationName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="locationName"
                  value={formData.locationName}
                  onChange={(e) =>
                    setFormData({ ...formData, locationName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="professionalSummary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Professional Summary
                </label>
                <textarea
                  id="professionalSummary"
                  rows={6}
                  value={formData.professionalSummary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      professionalSummary: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Write in Markdown format..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Skills
                </label>
                <div className="mt-2 space-y-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => {
                          const newSkills = [...formData.skills];
                          newSkills[index].name = e.target.value;
                          setFormData({ ...formData, skills: newSkills });
                        }}
                        placeholder="Enter skill name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <select
                        value={skill.level}
                        onChange={(e) => {
                          const newSkills = [...formData.skills];
                          newSkills[index].level = e.target.value;
                          setFormData({ ...formData, skills: newSkills });
                        }}
                        className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const newSkills = [...formData.skills];
                          newSkills.splice(index, 1);
                          setFormData({ ...formData, skills: newSkills });
                        }}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        skills: [
                          ...formData.skills,
                          { name: "", level: "intermediate" },
                        ],
                      })
                    }
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {profile.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>

              {profile.locationName && (
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {profile.locationName}
                </div>
              )}

              {profile.professionalSummary && (
                <div className="prose prose-indigo max-w-none">
                  <ReactMarkdown>{profile.professionalSummary}</ReactMarkdown>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill.name} • {skill.level}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
