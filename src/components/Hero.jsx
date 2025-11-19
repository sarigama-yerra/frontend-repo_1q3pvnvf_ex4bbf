import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden rounded-b-3xl">
      <Spline scene="https://prod.spline.design/2fSS9b44gtYBt4RI/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow">Aayaan Hospital</h1>
          <p className="mt-3 text-slate-300 max-w-xl">Modern, secure and connected healthcare platform for patients, doctors, laboratory and pharmacy — designed for speed and reliability.</p>
        </div>
      </div>
    </section>
  )
}
