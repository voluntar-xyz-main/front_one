import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export function useProfile() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    profile: api.auth.profile,
    loading: api.auth.loading,
    error: api.auth.error,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    professionalSummary: "",
    locationName: "",
    skills: [] as { name: string; level: string }[],
  });

  useEffect(() => {
    const unsubscribe = api.auth.addListener(() => {
      setState({
        profile: api.auth.profile,
        loading: api.auth.loading,
        error: api.auth.error,
      });
    });

    if (!api.auth.profile && api.auth.user) {
      api.auth.fetchProfile();
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (state.profile) {
      setFormData({
        fullName: state.profile.fullName || "",
        professionalSummary: state.profile.professionalSummary || "",
        locationName: state.profile.locationName || "",
        skills: state.profile.skills || [],
      });
    }
  }, [state.profile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (api.auth.user) {
      await api.auth.updateProfile(formData);
      setIsEditing(false);
    }
  };

  const handleSignOut = async () => {
    await api.signOut();
    navigate("/");
  };

  return {
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    isEditing,
    formData,
    setFormData,
    setIsEditing,
    handleSubmit,
    handleSignOut,
  };
}
