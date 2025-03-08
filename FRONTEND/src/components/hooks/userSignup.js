import React from 'react'
const userSignup= ()=> {
  const [loading,setLoading] = useState(false);

  const signup =async( {fullName,username,password,confirmPassword,gender})=>{
    const success= handleInputErrors({fullName,username,password,confirmPassword,gender})
if (!success)return;
try{
    const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
    });

    const data = await res.json();
    if (data.error) {
        throw new Error(data.error);
    }localStorage.setItem("chat-user", JSON.stringify(data));
    setAuthUser(data);

}catch(error){
    toast.error(error.message)
}finally{
    setLoading(false)
}
  }
  return (loading, signup)
}

export default userSignup

function handleInputErrors({fullName,username,password,confirmPassword,gender}){
    if (!fullName || !username || !password || !confirmPassword || !gender){
        toast.error("please fill all fields ")
        return false
    }
    if (password !== confirmPassword)
    {
        toast.error("password doesnt match")
        return false
    }
    if (password.length < 6 ) {
        toast.error("password should be atleast 6 letters ")
        return false
    }
    return true
}
