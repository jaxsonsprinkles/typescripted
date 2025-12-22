export default function Home() {
  return (
    <div className="flex flex-col space-y-3 items-center justify-center h-screen">
      <div className="flex flex-row gap-4">
        <div className="join">
          <input
            className="join-item btn"
            type="radio"
            name="time"
            aria-label="15"
          />
          <input
            className="join-item btn"
            type="radio"
            name="time"
            aria-label="30"
          />
          <input
            className="join-item btn"
            type="radio"
            name="time"
            aria-label="45"
          />
        </div>
      </div>
      <code className="p-8 rounded-xl bg-base-200 w-5/6 lg:w-2/3">
        join separate auspicious lean enormous consign discussion like island
        oven business organize
      </code>
    </div>
  );
}
