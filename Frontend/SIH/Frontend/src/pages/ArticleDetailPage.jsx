// src/pages/ArticleDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/mock-articles';

export default function ArticleDetailPage() {
  const { articleId } = useParams();
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">Article not found</h2>
        <Link to="/awareness" className="text-blue-600 mt-4 inline-block">
          &larr; Back to Awareness Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <Link to="/awareness" className="text-blue-600 mb-6 inline-block">
        &larr; Back to all articles
      </Link>
      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${article.category === 'Cyber Crime' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
        {article.category}
      </span>
      <h1 className="text-4xl font-extrabold my-4 text-gray-900">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">Published on: {new Date(article.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      {/* Using dangerouslySetInnerHTML because our mock data contains HTML tags */}
      {/* Be very careful with this if the data comes from an API to prevent XSS attacks */}
      <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}