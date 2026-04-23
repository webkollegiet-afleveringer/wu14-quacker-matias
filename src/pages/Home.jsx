import Header from "../components/Header";
import Loading from "../components/Loading";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
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
      <main className="container">

      <h2>home</h2>
      {loading ? (
          <Loading />
          
        ) : (
            posts.map((post) => <PostCard key={post.id} content={post.content} />)
        )}
        </main>
    </>
  );
}
