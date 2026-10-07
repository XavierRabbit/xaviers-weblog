export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto p-10 w-full">
      <h1 className="text-4xl font-serif font-bold text-accent-red mb-8">About Xavier</h1>
      
      <div className="prose prose-invert prose-lg prose-blue max-w-none">
        <p className="text-text-light leading-relaxed mb-6">
          I am an entrepreneur, technologist, linguist, and brand operator exploring the intersection of human experience and algorithmic logic.
        </p>
        
        <p className="text-text-light leading-relaxed mb-6">
          My journey into technology began with a deep fascination for both logic and philosophy. While Ludwig Wittgenstein's philosophy of language (语言哲学) profoundly shaped how I view communication and sparked my initial interest in Natural Language Processing (NLP), my early professional work was intensely visual. By 2022, I was working as an AI algorithm engineer at a medical AI unicorn in Beijing, specializing in Computer Vision (CV)—specifically analyzing fundus images to predict and diagnose heart disease.
        </p>

        <p className="text-text-light leading-relaxed mb-6">
          When ChatGPT launched that same year, it became clear that the landscape of programming was about to permanently shift. I realized that the true challenge of the future would not be writing the most elegant code, but cultivating genuine human connection. I made a deliberate choice to step away from the terminal to study people rather than syntax. 
        </p>

        <p className="text-text-light leading-relaxed mb-6">
          This realization led me to Switzerland, where I pursued a Master's degree in luxury management and guest experience. Today, I am based in Calgary, co-founding the e-commerce jewelry brand TriLume. My goal is not to abandon technology, but to reframe it: I leverage automation, Python, and AI to enhance human interaction, rather than allowing systems to dictate or control our behavior.
        </p>

        <blockquote className="text-text-light leading-relaxed mb-8 border-l-4 border-accent-red pl-6 italic opacity-90 bg-surface-blue bg-opacity-30 p-4 rounded-r-lg">
          This weblog is a deliberate rebellion against the noise of modern social media.
        </blockquote>

        <p className="text-text-light leading-relaxed mb-8">
          I have little interest in the fragmented, algorithm-driven world of endless scrolling and online short dramas. Instead, I built this space as a personal digital garden—a quiet, structured place to record my thoughts on language, culture, philosophy, and travel. It is a dedicated archive of my workflow and worldview, shared here for anyone who cares to read.
        </p>

        <h2 className="text-2xl font-serif font-semibold text-text-light mb-4 mt-12 border-b border-surface-blue pb-2">Current Focus</h2>
        <ul className="list-none pl-0 text-text-light opacity-90 space-y-4 mb-12">
          <li className="flex items-start gap-3">
            <span className="text-accent-red font-bold mt-1">✦</span>
            <span>Designing Next.js and Python-based utility web applications.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-red font-bold mt-1">✦</span>
            <span>Developing new styles and methods for language acquisition and learning.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-red font-bold mt-1">✦</span>
            <span>Optimizing supply chain and brand operations for TriLume Jewelry.</span>
          </li>
        </ul>

        <h2 className="text-2xl font-serif font-semibold text-text-light mb-4 border-b border-surface-blue pb-2">Previous Projects</h2>
        <p className="text-text-light leading-relaxed mb-4 opacity-80 italic text-sm">
          I will be writing detailed articles on this weblog to share my experiences from these projects in the coming days. I hope you can find some valuable insights from my journey.
        </p>
        <ul className="list-none pl-0 text-text-light opacity-90 space-y-4 mb-12">
          <li className="flex items-start gap-3">
            <span className="text-accent-red font-bold mt-1">▹</span>
            <span>Sourcing materials in China for a New York streetwear brand.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-red font-bold mt-1">▹</span>
            <span>Building and designing a language learning platform.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-red font-bold mt-1">▹</span>
            <span>Developing "Daily Compass".</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-red font-bold mt-1">▹</span>
            <span>Managing social media operations for a Hong Kong women's healthcare brand.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-red font-bold mt-1">▹</span>
            <span className="italic opacity-70">More dispatches to follow...</span>
          </li>
        </ul>

        {/* Social Links Footer */}
        <div className="mt-16 pt-8 border-t border-surface-blue flex flex-wrap gap-6 text-sm font-bold uppercase tracking-wider">
          <a href="https://www.tiktok.com/@superquietman" target="_blank" rel="noopener noreferrer" className="text-text-light opacity-50 hover:opacity-100 hover:text-accent-red transition-colors">TikTok</a>
          <a href="https://github.com/XavierRabbit" target="_blank" rel="noopener noreferrer" className="text-text-light opacity-50 hover:opacity-100 hover:text-accent-red transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/wang-xavier-a4162016b/" target="_blank" rel="noopener noreferrer" className="text-text-light opacity-50 hover:opacity-100 hover:text-accent-red transition-colors">LinkedIn</a>
          <a href="https://x.com/superquietman" target="_blank" rel="noopener noreferrer" className="text-text-light opacity-50 hover:opacity-100 hover:text-accent-red transition-colors">Twitter</a>
          <a href="https://www.reddit.com/user/Superquietman/" target="_blank" rel="noopener noreferrer" className="text-text-light opacity-50 hover:opacity-100 hover:text-accent-red transition-colors">Reddit</a>
        </div>
      </div>
    </main>
  );
}