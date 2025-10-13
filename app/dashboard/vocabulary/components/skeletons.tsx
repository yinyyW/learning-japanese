export function WordCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl py-5 px-3 my-2 animate-pulse">
      <div className="flex w-full justify-between">
        <div>
          <h4 className="text-4xl bg-gray-200 rounded w-24 h-8 mb-2"></h4>
          <p className="ms-1 bg-gray-200 rounded w-16 h-4"></p>
        </div>
        <span className="me-2 bg-gray-200 rounded-full w-8 h-8"></span>
      </div>
      <div className="mt-5 ms-1">
        <p className="bg-gray-200 rounded w-40 h-4 mb-2"></p>
        <div className="flex flex-col md:flex-row justify-between mt-2">
          <div>
            <p className="bg-gray-200 rounded w-32 h-4 mb-1"></p>
            <p className="bg-gray-200 rounded w-32 h-4"></p>
          </div>
          <div className="self-end flex gap-2">
            <span className="bg-gray-200 rounded w-10 h-4"></span>
            <span className="bg-gray-200 rounded w-10 h-4"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WordListSkeleton() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, index) => (
        <WordCardSkeleton key={index} />
      ))}
    </div>
  );
}