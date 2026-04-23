import Header from "../components/Header";
import Loading from "../components/Loading";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PostCard from "../components/PostCard";
import "./Home.scss";

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const postsCollection = collection(db, "quacks");
      const snapshot = await getDocs(postsCollection);
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }

    fetchPosts();
  }, []);
  return (
    <>
      <Header />
      <main className="container home-page">
        {loading ? (
          <Loading />
        ) : (
          <ul className="home">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </ul>
        )}
        <button type="button" onClick={() => navigate("/add-post")}>Add a Quack</button>
      </main>
    </>
  );
}
