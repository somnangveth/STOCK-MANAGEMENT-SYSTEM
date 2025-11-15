export type Member = {
  admin_id?: string;
  staff_id?: string;
};
export type Staff ={
staff_id: string;
name: string;
email: string;
profile_image: string;
password: string;
status: "active" | "resigned";
role: "staff" |  "admin";
}

export type Admin = {
admin_id: string;
name: string;
email: string;
profile_image: string;
password: string;
status: 'active' | 'resigned';
role: 'admin';
}