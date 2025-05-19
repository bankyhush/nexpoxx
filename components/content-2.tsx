export default function ContentSection2() {
  return (
    <section className="flex flex-col items-center justify-center w-full px-6 py-20 bg-white dark:bg-neutral-900">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-5xl">
          With you every step of the way
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          <i>
            From making your first crypto trade to becoming a seasoned trader,
            you’ll have us to guide you through the process. No question is too
            small. No sleepless nights. Have confidence in your crypto.
          </i>
        </p>

        <center>
          <video
            className="w-full object-contain rounded-lg shadow-lg dark:mix-blend-lighten dark:invert-0"
            style={{ visibility: "visible" }}
            autoPlay
            loop
            muted
            playsInline
            poster="/clips/d40.jpg"
            aria-label="Animation of the NS product in action"
            role="img"
          >
            <source src="/clips/d40.webm" type="video/mp4" />
          </video>
        </center>
      </div>
    </section>
  );
}
