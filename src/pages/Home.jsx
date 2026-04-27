import Header from "../components/Header";
import Loading from "../components/Loading";
import { db } from "../firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PostCard from "../components/PostCard";
import "./Home.scss";
import AddPost from "./AddPost";
import AddPostBtn from "../components/AddPostBtn";

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      try {
        const postsCollection = collection(db, "quacks");
        const snapshot = await getDocs(postsCollection);
        const rawPosts = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        const uniqueUids = [...new Set(rawPosts.map((post) => post.uid).filter(Boolean))];

        const profilePairs = await Promise.all(
          uniqueUids.map(async (uid) => {
            try {
              const profileSnapshot = await getDoc(doc(db, "users", uid));
              return [uid, profileSnapshot.exists() ? profileSnapshot.data() : {}];
            } catch {
              return [uid, {}];
            }
          })
        );

        const profilesByUid = Object.fromEntries(profilePairs);
        const mergedPosts = rawPosts.map((post) => {
          const profile = profilesByUid[post.uid] || {};
          return {
            ...post,
            displayName: post.displayName || profile.displayName || "",
            username: post.username || profile.username || "",
            photoURL: post.photoURL || profile.photoURL || "",
          };
        });

        if (isMounted) {
          setPosts(mergedPosts);
        }
      } catch {
        if (isMounted) {
          setPosts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
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
      </main>
      <AddPostBtn onClick={() => navigate("/add-post")} />
    </>
  );
}
