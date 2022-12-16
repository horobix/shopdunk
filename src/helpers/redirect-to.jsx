import { redirect } from "react-router-dom";

const redirectTo = async (route) => {
  redirect(route);
};

export default redirectTo;
