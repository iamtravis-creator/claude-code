import ThemeSwitcher from './components/ThemeSwitcher'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Features from './components/Features'
import Checklist from './components/Checklist'
import Pricing from './components/Pricing'
import QuoteCalculator from './components/QuoteCalculator'
import Testimonials from './components/Testimonials'
import PreferredSupplier from './components/PreferredSupplier'
import Suburbs from './components/Suburbs'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <ThemeSwitcher />
      <Nav />
      <main>
        <Hero />
        <Features />
        <Checklist />
        <Pricing />
        <QuoteCalculator />
        <Testimonials />
        <PreferredSupplier />
        <Suburbs />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
