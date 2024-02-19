import "./styles/names.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_URL } from '../config.js'

function Name(props){
  async function addFriend(){
    console.log(props.prop.username)
    const response = await fetch(`${SERVER_URL}/api/addFriend`,
    {method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"friendID":props.prop._id,"currentUserID":localStorage.getItem("token")})})
    var res = await response.json()
    if (res.status == "error"){
      toast.error(res.error)
    }
    if(res.status != "error"){
      toast.success("Friend added successfully")
    }
    console.log(res.status) 
  }
  
  return(
    <>
      <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    />
      <div className="name">
        <p>{props.prop.name}</p>
        <p>{props.prop.username}</p>
        <button onClick={addFriend}>
        <span className="material-symbols-outlined">
          add
        </span>
        </button>
      </div>
    </>
  )
}
export default Name
