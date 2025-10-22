import UserEdit from "./UserEdit";
import UsersList from "./UsersList";
import {useState} from "react";

const UserEditList = () => {

    const [userToEdit, setUserToEdit] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    return(
        <>
            <UsersList key={refreshKey} onEditClick={setUserToEdit} />
            {userToEdit && <UserEdit user={userToEdit} onReset={() => {setUserToEdit(null); setRefreshKey(old => old + 1);}} />}
        </>
    );
}

export default UserEditList;
