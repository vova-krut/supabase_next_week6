import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
// @ts-ignore
export default function Account({ session }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [phone, setPhone] = useState<number>(0);
  const [first_name, setfirst_name] = useState<string>("");
  const [last_name, setlast_name] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");

  useEffect(() => {
    getProfile();
    getImg();
  }, [session]);

  //@ts-ignore
  const handleUpload = async (e) => {
    e.preventDefault();
    const user = supabase.auth.user();
    setLoading(true);

    const formData = new FormData(e.target);
    const avatarFile = formData.get("avatar");
    const {
      //@ts-ignore
      data: { Key: avatarKey },
    } = await supabase.storage
      .from("avatars")
      //@ts-ignore
      .upload(
        //@ts-ignore
        `${supabase.auth.user()!.id}/${avatarFile.name}`,
        //@ts-ignore
        formData.get("avatar"),
        {
          cacheControl: "3600",
          upsert: true,
        }
      );

    //@ts-ignore
    const publicUrl: string = await supabase.storage
      .from("avatars")
      //@ts-ignore
      .getPublicUrl(`${supabase.auth.user()!.id}/${avatarFile.name}`).publicURL;
    setAvatarUrl(publicUrl);

    const updates = {
      id: user?.id,
      email: session.user.email,
      doc_url: publicUrl,
      updated_at: new Date(),
    };

    let { data } = await supabase
      .from("UserData")
      .select("email")
      .eq("email", session.user.email);
    console.log(data);
    //@ts-ignore
    if (data.length !== 0) {
      let { error } = await supabase.from("UserData").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } else {
      let { error } = await supabase.from("UserData").insert(
        { created_at: new Date(), ...updates },
        {
          returning: "minimal", // Don't return the value after inserting
        }
      );

      if (error) {
        throw error;
      }
    }

    setLoading(false);
  };

  async function getImg() {
    setLoading(true);
    const user = supabase.auth.user();

    let { data, error, status } = await supabase
      .from("UserData")
      .select(`doc_url`)
      .eq("id", user?.id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      setAvatarUrl(data.doc_url);
    }
  }

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("UserData")
        .select(`phone, first_name, last_name, country, city`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setPhone(data.phone);
        setfirst_name(data.first_name);
        setlast_name(data.last_name);
        setCountry(data.country);
        setCity(data.city);
      }
    } catch (error) {
      // @ts-ignore
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  // @ts-ignore
  async function updateProfile(phone, first_name, last_name, country, city) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user?.id,
        email: session.user.email,
        phone,
        first_name,
        last_name,
        country,
        city,
        updated_at: new Date(),
      };

      let { data } = await supabase
        .from("UserData")
        .select("id")
        .eq("id", user?.id);
      console.log(data);
      //@ts-ignore
      if (data.length !== 0) {
        let { error } = await supabase.from("UserData").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        });

        if (error) {
          throw error;
        }
      } else {
        let { error } = await supabase.from("UserData").insert(
          { created_at: new Date(), ...updates },
          {
            returning: "minimal", // Don't return the value after inserting
          }
        );

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      // @ts-ignore
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <form className="imgform" onSubmit={handleUpload}>
        {avatarUrl && (
          <div className="Image">
            <Image
              className="Image"
              src={avatarUrl}
              width={256}
              height={256}
              alt="avatar"
            />
          </div>
        )}
        <input id="file" className="inputfile" type="file" name="avatar" />
        <label htmlFor="file" className="inputImg">
          Choose a file...
        </label>
        <button className="imgBtn" type="submit" disabled={loading}>
          <span>{loading ? "Loading" : "Upload avatar"}</span>
        </button>
      </form>
      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          value={phone || ""}
          onChange={(e) => setPhone(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          type="text"
          value={first_name || ""}
          onChange={(e) => setfirst_name(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="last_name">Last name</label>
        <input
          id="last_name"
          type="text"
          value={last_name || ""}
          onChange={(e) => setlast_name(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          value={country || ""}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          value={city || ""}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div>
        <button
          className="button block primary"
          onClick={() =>
            updateProfile(phone, first_name, last_name, country, city)
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
