import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

const TABLES = {
  feedings: { order: "time", ascending: false },
  litter: { table: "litter_logs", order: "time", ascending: false },
  grooming: { table: "grooming_logs", order: "time", ascending: false },
  zoomies: { table: "zoomies_logs", order: "time", ascending: false },
  weights: { order: "date", ascending: true },
  milestones: { order: "date", ascending: false },
};

const tableName = (key) => TABLES[key].table || key;

export function useLailaData() {
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState({
    feedings: [],
    litter: [],
    grooming: [],
    zoomies: [],
    weights: [],
    milestones: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [feedings, litter, grooming, zoomies, weights, milestones, profileRes] = await Promise.all([
        supabase.from("feedings").select("*").order("time", { ascending: false }),
        supabase.from("litter_logs").select("*").order("time", { ascending: false }),
        supabase.from("grooming_logs").select("*").order("time", { ascending: false }),
        supabase.from("zoomies_logs").select("*").order("time", { ascending: false }),
        supabase.from("weights").select("*").order("date", { ascending: true }),
        supabase.from("milestones").select("*").order("date", { ascending: false }),
        supabase.from("profile").select("*").limit(1).maybeSingle(),
      ]);

      const firstError = [feedings, litter, grooming, zoomies, weights, milestones, profileRes].find((r) => r.error);
      if (firstError) throw firstError.error;

      setData({
        feedings: feedings.data || [],
        litter: litter.data || [],
        grooming: grooming.data || [],
        zoomies: zoomies.data || [],
        weights: weights.data || [],
        milestones: milestones.data || [],
      });
      setProfile(profileRes.data || null);
      setError("");
    } catch (e) {
      setError("Couldn't load data — check your Supabase connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const insertRow = async (key, row) => {
    try {
      const { data: inserted, error: err } = await supabase
        .from(tableName(key))
        .insert(row)
        .select()
        .single();
      if (err) throw err;
      setData((prev) => {
        const next = [inserted, ...prev[key]];
        if (TABLES[key].order === "date" && TABLES[key].ascending) {
          next.sort((a, b) => a.date.localeCompare(b.date));
        } else if (TABLES[key].order === "date") {
          next.sort((a, b) => b.date.localeCompare(a.date));
        }
        return { ...prev, [key]: next };
      });
      setError("");
      return inserted;
    } catch (e) {
      setError("Couldn't save — try again.");
      return null;
    }
  };

  const deleteRow = async (key, id) => {
    try {
      const { error: err } = await supabase.from(tableName(key)).delete().eq("id", id);
      if (err) throw err;
      setData((prev) => ({ ...prev, [key]: prev[key].filter((r) => r.id !== id) }));
      setError("");
    } catch (e) {
      setError("Couldn't delete — try again.");
    }
  };

  const saveProfile = async (next) => {
    try {
      let result;
      if (profile?.id) {
        result = await supabase.from("profile").update(next).eq("id", profile.id).select().single();
      } else {
        result = await supabase.from("profile").insert(next).select().single();
      }
      if (result.error) throw result.error;
      setProfile(result.data);
      setError("");
      return result.data;
    } catch (e) {
      setError("Couldn't save profile — try again.");
      return null;
    }
  };

  return { profile, data, loading, error, setError, insertRow, deleteRow, saveProfile, reload: loadAll };
}
