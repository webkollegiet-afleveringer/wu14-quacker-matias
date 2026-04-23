import AddPostImg from "../assets/icons/addpost.svg";
import { useNavigate } from "react-router";
import "./AddPostBtn.scss";
export default function AddPostBtn({ onClick }) {
    const navigate = useNavigate();
    return (
        <div className="add-post__wrapper">

        <button className="add-post" type="button" onClick={onClick}>
            <img src={AddPostImg} alt="Add Post" />
        </button>
        </div>
    );
}