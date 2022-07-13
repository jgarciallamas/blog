import Head from "next/head";
import { client } from "lib/sanity";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

export async function getStaticPaths() {
  const posts = await client.fetch(
    `*[_type == "post"]{ 'slug': slug.current }`
  );
  console.log("posts --> ", posts);

  const paths = posts?.map((post) => ({ params: { slug: post.slug } }));
  console.log("paths -->", paths);
  return {
    paths: paths,
    // posts?.map((post) => ({
    //   params: {
    //     slug: post.slug,
    //   },
    // })) || [],
    fallback: false,
  };
}

export async function getStaticProps(context) {
  console.log("context -->", context);
  const { params } = context;

  const posts = await client.fetch(
    `*[_type == "post" && slug.current == $slug] {
    _id,
    title,
    publishedAt,
    body,
    'slug': slug.current,
  }`,
    { slug: params.slug }
  );

  return {
    props: {
      post: posts[0],
    },
  };
}

export default function Post({ post }) {
  return (
    <div className="bg-gray-200 min-h-screen">
      <Head>
        <title>{post.title}</title>
        <meta name="description" content="A blog post" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="py-8">
        <Link as="/" href={"/"}>
          <a className="block text-center underline">&#8592; Back</a>
        </Link>
        <h1 className="mt-10 text-center text-3xl mb-10 font-extrabold tracking-tight text-gray-900">
          {post.title}
        </h1>

        <div className="mt-20 mx-auto text-center max-w-3xl px-10">
          <div className="mb-10 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <p className="mb-6 text-gray-400 uppercase text-sm">
              {new Date(post.publishedAt).toDateString().slice(4)}
            </p>
            <PortableText value={post.body} />
          </div>
        </div>
      </div>
    </div>
  );
}
