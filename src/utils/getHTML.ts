import axios from "axios";

export const getHTML = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log("Site dont allow parsing");
  }
};
