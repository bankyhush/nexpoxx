import React from "react";
import AdminCoinEditForm from "./EditForm";

const Editpage = ({ params }: { params: { id: string } }) => {
  return <AdminCoinEditForm id={params.id} />;
};

export default Editpage;
