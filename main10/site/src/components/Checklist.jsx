import { checklist } from '../data/site'
import Icon from './Icon'

export default function Checklist() {
  return (
    <section className="section bg-band text-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-accent">The checklist</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Every area. Every detail. Every time.
          </h2>
          <p className="mt-4 text-white/70">
            We clean to the REIV inspection standard — the same checklist your
            agent uses on the day.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {checklist.map((group) => (
            <div
              key={group.area}
              className="rounded-xl2 border border-white/10 bg-white/[0.05] p-6"
            >
              <h3 className="text-base font-bold text-accent">{group.area}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-white/80">
                    <Icon name="check" className="mt-0.5 h-4 w-4 flex-none text-trust" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
