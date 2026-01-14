const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'أفضل اتجاهات حقائب اليد لعام 2020',
      excerpt: 'اكتشف أحدث اتجاهات الموضة في حقائب اليد لهذا العام. من التصاميم الكلاسيكية إلى العصرية.',
      tag: 'صحة',
      date: '29 سبتمبر 2024',
      readTime: '25 دقيقة قراءة',
      image: '🔥'
    },
    {
      id: 2,
      title: 'أفضل استراتيجيات تحسين محركات البحث!',
      excerpt: 'تعلم كيفية تحسين موقعك الإلكتروني لتحسين ترتيبه في محركات البحث وجذب المزيد من الزوار.',
      tag: 'نصائح السفر',
      date: '25 سبتمبر 2024',
      readTime: '18 دقيقة قراءة',
      image: '🏄'
    },
    {
      id: 3,
      title: 'أي شركة ستختار؟',
      excerpt: 'دليل شامل لمساعدتك في اختيار الشركة المناسبة لاحتياجاتك. نصائح ومقارنات مفيدة.',
      tag: 'نصائح السفر',
      date: '20 سبتمبر 2024',
      readTime: '15 دقيقة قراءة',
      image: '🚐'
    },
    {
      id: 4,
      title: 'حيل بائعي السيارات المستعملة المكشوفة',
      excerpt: 'اكتشف الحيل التي يستخدمها بائعو السيارات المستعملة وكيفية تجنبها عند الشراء.',
      tag: 'تصميم',
      date: '15 سبتمبر 2024',
      readTime: '20 دقيقة قراءة',
      image: '🏛️'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex justify-between items-start mb-15 text-right gap-5 flex-wrap md:flex-nowrap">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-5">من مدونتنا</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              اكتشف أحدث المقالات والأخبار من فريقنا. نشاركك رؤى قيمة ونصائح مفيدة.
            </p>
          </div>
          <a href="#all-posts" className="text-primary no-underline font-semibold whitespace-nowrap mt-2.5 hover:underline">عرض الكل →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md transition-all hover:-translate-y-1 hover:shadow-xl text-right">
              <div className="w-full h-[200px] overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-6xl">{post.image}</div>
              </div>
              <div className="p-6">
                <span className="inline-block bg-primary/10 text-primary py-1 px-3 rounded-full text-xs font-semibold mb-4">{post.tag}</span>
                <h3 className="text-xl font-bold text-gray-800 mb-3 leading-snug">{post.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>{post.date}</span>
                  <span className="before:content-['•'] before:mr-4">{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

