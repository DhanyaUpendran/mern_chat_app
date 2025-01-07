import Conversations from "./Conversations"
import SearchInput from "./SearchInput"
import LogoutButton from "./LogotButton"

const Sidebar =()=>{
    return (

        <div className="border-r border-slate-500 p-4 flex flex-col">
            <SearchInput />
            <div className="divide px-3"></div>
            <Conversations />
           <LogoutButton/>
        </div>
    )
}
export default Sidebar