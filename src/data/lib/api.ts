import { SupabaseApi } from "./Supabase_api";
import type {
  Collection,
  Job,
  JobSearchParams,
  Organization,
  Profile,
} from "../types";

type AuthEventType =
  | "SIGNED_IN"
  | "SIGNED_OUT"
  | "USER_UPDATED"
  | "PROFILE_UPDATED"
  | "AUTH_STATE_CHANGE";
type AuthListener = (event: AuthEventType, data?: any) => void;

class Auth {
  private api: SupabaseApi;
  private _user: any | null = null;
  private _profile: Profile | null = null;
  private _loading: boolean = true;
  private _error: string | null = null;
  private listeners: AuthListener[] = [];

  constructor(api: SupabaseApi) {
    this.api = api;
    this.initAuth();
  }

  private async initAuth() {
    if (this._user) return;

    try {
      const { user } = await this.api.getCurrentUser();
      if (user) {
        this._user = user;
        this.notifyListeners("AUTH_STATE_CHANGE", { user });
        await this.fetchProfile();
      } else {
        this._loading = false;
        this.notifyListeners("AUTH_STATE_CHANGE", { user: null });
      }
    } catch (error) {
      this._error =
        error instanceof Error
          ? error.message
          : "Authentication initialization failed";
      this._loading = false;
      this.notifyListeners("AUTH_STATE_CHANGE", { error: this._error });
    }
  }

  async fetchProfile() {
    try {
      if (!this._user) return null;

      this._loading = true;
      this.notifyListeners("AUTH_STATE_CHANGE", { loading: true });

      const profile = await this.api.getProfile(this._user.id);
      this._profile = profile;
      this._loading = false;

      this.notifyListeners("PROFILE_UPDATED", { profile });
      return profile;
    } catch (error) {
      this._error =
        error instanceof Error ? error.message : "Failed to fetch profile";
      this._loading = false;
      this.notifyListeners("AUTH_STATE_CHANGE", { error: this._error });
      return null;
    }
  }

  async updateProfile(profileData: Partial<Profile>) {
    try {
      if (!this._user) throw new Error("Not authenticated");

      const updatedProfile = await this.api.updateProfile(
        this._user.id,
        profileData
      );
      this._profile = updatedProfile;

      this.notifyListeners("PROFILE_UPDATED", { profile: updatedProfile });
      return updatedProfile;
    } catch (error) {
      this._error =
        error instanceof Error ? error.message : "Failed to update profile";
      this.notifyListeners("AUTH_STATE_CHANGE", { error: this._error });
      throw error;
    }
  }

  async signIn(credentials: { email: string; password: string }) {
    try {
      const { user, error } = await this.api.signIn(credentials);
      if (error) throw error;

      this._user = user;
      this.notifyListeners("SIGNED_IN", { user });
      await this.fetchProfile();
      return { user };
    } catch (error) {
      this._error = error instanceof Error ? error.message : "Sign in failed";
      this.notifyListeners("AUTH_STATE_CHANGE", { error: this._error });
      throw error;
    }
  }

  async signUp(params: {
    email: string;
    password: string;
    options?: {
      data: { full_name: string };
    };
  }) {
    try {
      const { user, error } = await this.api.signUp(params);
      if (error) throw error;

      this._user = user;
      this.notifyListeners("SIGNED_IN", { user });
      return { user };
    } catch (error) {
      this._error = error instanceof Error ? error.message : "Sign up failed";
      this.notifyListeners("AUTH_STATE_CHANGE", { error: this._error });
      throw error;
    }
  }

  async signOut() {
    try {
      await this.api.signOut();
      this._user = null;
      this._profile = null;
      this.notifyListeners("SIGNED_OUT");
    } catch (error) {
      this._error = error instanceof Error ? error.message : "Sign out failed";
      this.notifyListeners("AUTH_STATE_CHANGE", { error: this._error });
      throw error;
    }
  }

  addListener(listener: AuthListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(event: AuthEventType, data?: any) {
    this.listeners.forEach((listener) => listener(event, data));
  }

  get user() {
    return this._user;
  }

  get profile() {
    return this._profile;
  }

  get loading() {
    return this._loading;
  }

  get error() {
    return this._error;
  }

  get isAuthenticated() {
    return !!this._user;
  }
}

export class Api {
  private apiImplementation: SupabaseApi;
  auth: Auth;

  constructor() {
    this.apiImplementation = new SupabaseApi();
    this.auth = new Auth(this.apiImplementation);
  }

  async signUp(params: {
    email: string;
    password: string;
    options?: {
      data: { full_name: string };
    };
  }) {
    return this.auth.signUp(params);
  }

  async signIn(params: { email: string; password: string }) {
    return this.auth.signIn(params);
  }

  async signOut() {
    return this.auth.signOut();
  }

  setAuthChangeHandler(
    callback: (event: string, session: any | null) => void
  ): { unsubscribe: () => void } {
    return this.apiImplementation.setAuthChangeHandler(callback);
  }

  async getCurrentUser() {
    return this.apiImplementation.getCurrentUser();
  }

  async getProfile(userId: string) {
    return this.apiImplementation.getProfile(userId);
  }

  async updateProfile(userId: string, profile: Partial<Profile>) {
    return this.apiImplementation.updateProfile(userId, profile);
  }

  async getCollectionWithItems(id: string) {
    return this.apiImplementation.getCollectionWithItems(id);
  }

  async getOwnCollections() {
    return this.apiImplementation.getOwnCollections();
  }
  async getCollectionsWithItems(userId: string) {
    return this.apiImplementation.getCollectionsWithItems(userId);
  }

  async createCollection(collection: Partial<Collection>) {
    return this.apiImplementation.createCollection(collection);
  }

  async addToCollectionAndGetUpdated(params: {
    collectionId: string;
    jobId?: string;
    organizationId?: string;
    subCollectionId?: string;
  }) {
    return this.apiImplementation.addToCollectionAndGetUpdated(params);
  }

  async getOrganizations() {
    return this.apiImplementation.getOrganizations();
  }

  async createOrganization(organization: Partial<Organization>) {
    return this.apiImplementation.createOrganization(organization);
  }

  async getOrganizationWithDetails(id: string) {
    return this.apiImplementation.getOrganizationWithDetails(id);
  }

  async searchJobs(params: JobSearchParams) {
    return this.apiImplementation.searchJobs(params);
  }

  async createJob(job: Partial<Job>) {
    return this.apiImplementation.createJob(job);
  }

  async getJobWithOrganization(id: string) {
    return this.apiImplementation.getJobWithOrganization(id);
  }

  async searchAll(query: string, searchType: string) {
    return this.apiImplementation.searchAll(query, searchType);
  }

  async getPageLayoutWithContent(slug: string) {
    return this.apiImplementation.getPageLayoutWithContent(slug);
  }
}

export const api = new Api();
