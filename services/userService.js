import { supabase } from "../lib/supabase";

export const getUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      return { success: false, msg: error?.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("got error", error);
    return { success: false, msg: error?.message };
  }
};

export const updateUserData = async (userId, data) => {
  try {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);

    if (error) {
      return { success: false, msg: error?.message };
    }
    return { success: true };
  } catch (error) {
    console.log("got error", error);
    return { success: false, msg: error?.message };
  }
};

export const sendForgotPasswordMail = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://example.com/update-password",
    });
    if (error) {
      return { success: false, msg: error?.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("got error", error);
    return { success: false, msg: error?.message };
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      return { success: false, msg: error?.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("got error", error);
    return { success: false, msg: error?.message };
  }
};

export const updateUserPassword = async (password) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      return { success: false, msg: error?.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("got error", error);
    return { success: false, msg: error?.message };
  }
};
