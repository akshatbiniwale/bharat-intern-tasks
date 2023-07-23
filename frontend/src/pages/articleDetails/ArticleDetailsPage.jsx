import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Italic from "@tiptap/extension-italic";
import Text from "@tiptap/extension-text";
import MainLayout from "../../components/MainLayout";
import images from "../../constants/images";
import SuggestedPosts from "./container/SuggestedPosts";
import CommentsContainer from "../../components/comments/CommentsContainer";
import SocialShareButtons from "../../components/comments/SocialShareButtons";
import stables from "./../../constants/stables";
import parse from "html-react-parser";
import ArticleDetailSkeleton from "./components/ArticleDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";

import { useState } from "react";
import { BreadCrumbs } from "../../components/BreadCrumbs";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOnePost } from "../../services/index/posts";
import { generateHTML } from "@tiptap/html";
import { useSelector } from "react-redux";

const postsData = [
    {
        _id: "1",
        image: images.PostImage,
        title: "Help children get better education",
        createdAt: "2023-01-28T15:35:53.607+0000",
    },
    {
        _id: "2",
        image: images.PostImage,
        title: "Help children get better education",
        createdAt: "2023-01-28T15:35:53.607+0000",
    },
    {
        _id: "3",
        image: images.PostImage,
        title: "Help children get better education",
        createdAt: "2023-01-28T15:35:53.607+0000",
    },
    {
        _id: "4",
        image: images.PostImage,
        title: "Help children get better education",
        createdAt: "2023-01-28T15:35:53.607+0000",
    },
];

const tagsData = [
    "Medical",
    "Lifestyle",
    "Learn",
    "Healthy",
    "Food",
    "Diet",
    "Education",
];

const ArticleDetails = () => {
    const { slug } = useParams();
    const userState = useSelector((state) => state.user);
    const [breadCrumbsData, setBreadCrumbsData] = useState([]);
    const [body, setBody] = useState(null);

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getOnePost({ slug }),
        onSuccess: (data) => {
            setBreadCrumbsData([
                { name: "Home", link: "/" },
                { name: "Blog", link: "/blog" },
                { name: "Article", link: `/blog/${slug}` },
            ]);
            setBody(
                parse(
                    generateHTML(data?.body, [
                        Document,
                        Paragraph,
                        Text,
                        Bold,
                        Italic,
                    ])
                )
            );
        },
        queryKey: ["blog", slug],
    });

    return (
        <MainLayout>
            {isLoading ? (
                <ArticleDetailSkeleton />
            ) : isError ? (
                <ErrorMessage message="Something went wrong." />
            ) : (
                <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
                    <article className="flex-1">
                        <BreadCrumbs data={breadCrumbsData} />
                        <img
                            className="rounded-xl w-full"
                            src={
                                data?.photo
                                    ? stables.uploadFolderBaseUrl + data?.photo
                                    : images.noImage
                            }
                            alt={data?.title}
                        />
                        <div className="mt-4 flex gap-2">
                            {data?.categories.map((category) => (
                                <Link
                                    to={`/blog?category=${category.name}`}
                                    className="text-primary text-sm font-roboto inline-block md:text-base"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                        <h1 className="text-xl font-medium font-roboto mt-4 text-dark-hard md:text-[26px]">
                            {data?.title}
                        </h1>
                        <div className="mt-4 prose prose-sm sm:prose-base">
                            {body}
                        </div>
                        <CommentsContainer
                            className="mt-10"
                            loggedInUserId={userState.userInfo._id}
                            comments={data.comments}
                        />
                    </article>
                    <div>
                        <SuggestedPosts
                            className="mt-8 lg:mt-0 lg:max-w-xs"
                            tags={tagsData}
                            heading="Latest Articles"
                            posts={postsData}
                        />
                        <div className="mt-7">
                            <h2 className="font-roboto font-medium text-dark-hard mb-4 md:text-xl">
                                Share On:
                            </h2>
                            <SocialShareButtons
                                url={encodeURI(
                                    "https://github.com/akshatbiniwale"
                                )}
                                title={encodeURIComponent("Akshat Biniwale")}
                            />
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
};

export default ArticleDetails;
