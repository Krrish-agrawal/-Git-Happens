const PagePlaceholder = ({ title }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">
        This is a placeholder for the {title} page. Content coming soon!
      </p>
    </div>
  );
};

export default PagePlaceholder; 