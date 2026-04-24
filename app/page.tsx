'use client'

import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox, CheckboxField } from '@/components/ui/checkbox'
import { Divider } from '@/components/ui/divider'
import { Description, Field, Fieldset, Label, Legend } from '@/components/ui/fieldset'
import { Heading, Subheading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'

const componentGroups = [
  {
    name: 'UI primitives',
    count: 27,
    path: 'components/ui',
    description: 'Buttons, inputs, dialogs, tables, nav shells, and form controls.',
    status: 'Ready',
  },
  {
    name: 'Marketing elements',
    count: 16,
    path: 'components/elements',
    description: 'Reusable page building blocks for headings, sections, copy, logos, and demos.',
    status: 'Ready',
  },
  {
    name: 'Page sections',
    count: 38,
    path: 'components/sections',
    description: 'Hero, pricing, FAQ, stats, team, testimonial, footer, and CTA templates.',
    status: 'Templates',
  },
  {
    name: 'Icon set',
    count: 112,
    path: 'components/icons',
    description: 'Local SVG components for product navigation, actions, social links, and states.',
    status: 'Asset',
  },
]

const templateRoutes = [
  {
    label: 'Home',
    route: '/home-01',
    variants: '3 variants',
    description: 'Hero, product demo, stats, pricing, FAQ, and testimonial composition.',
  },
  {
    label: 'Pricing',
    route: '/pricing-01',
    variants: '3 variants',
    description: 'Single tier, multi tier, comparison table, and proof section patterns.',
  },
  {
    label: 'About',
    route: '/about-01',
    variants: '3 variants',
    description: 'Mission copy, stats, team grids, brand cards, and social proof layouts.',
  },
  {
    label: 'Legal and 404',
    route: '/privacy-policy-01',
    variants: '4 variants',
    description: 'Document layouts, navigation shells, footer systems, and error page heroes.',
  },
]

const primitiveSamples = [
  'Button',
  'Badge',
  'Input',
  'Select',
  'Textarea',
  'Checkbox',
  'Table',
  'Avatar',
  'Divider',
  'Fieldset',
  'Dialog',
  'Dropdown',
]

export default function Home() {
  const [activeTemplate, setActiveTemplate] = useState(templateRoutes[0])

  return (
    <main className="min-h-dvh bg-olive-100 text-olive-950 dark:bg-olive-950 dark:text-white">
      <header className="sticky top-0 z-20 border-b border-olive-950/10 bg-olive-100/85 backdrop-blur dark:border-white/10 dark:bg-olive-950/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#" className="flex items-center gap-3 font-semibold">
            <span className="grid size-9 place-items-center rounded-lg bg-olive-950 text-sm text-white shadow-sm dark:bg-white dark:text-olive-950">
              EB
            </span>
            <span>Website kit</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm/6 font-medium text-olive-700 md:flex dark:text-olive-300">
            <a href="#components" className="hover:text-olive-950 dark:hover:text-white">
              Components
            </a>
            <a href="#templates" className="hover:text-olive-950 dark:hover:text-white">
              Templates
            </a>
            <a href="#preview" className="hover:text-olive-950 dark:hover:text-white">
              Preview
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-20">
        <div className="flex flex-col justify-center">
          <Badge color="emerald" className="w-fit">
            Internal component showcase
          </Badge>
          <h1 className="mt-6 max-w-4xl font-display text-5xl/14 text-balance sm:text-6xl/18 lg:text-7xl/20">
            A quick map of the building blocks already in this website.
          </h1>
          <p className="mt-6 max-w-2xl text-lg/8 text-olive-700 dark:text-olive-300">
            This page replaces the default Next screen with a practical preview for developers. It shows the local
            theme, basic UI primitives, component groups, and template routes that are already available in the repo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#preview" color="dark">
              View primitives
            </Button>
            <Button href="#templates" outline>
              Browse templates
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-olive-950/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="rounded-lg bg-olive-950 p-5 text-white shadow-sm dark:bg-white dark:text-olive-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm/6 font-medium text-white/60 dark:text-olive-700">Theme signal</p>
                <p className="mt-1 text-2xl/8 font-semibold">Olive system, calm surfaces</p>
              </div>
              <div className="flex -space-x-2">
                <Avatar initials="UI" className="size-10 bg-olive-200 text-olive-950" />
                <Avatar initials="SE" className="size-10 bg-emerald-200 text-emerald-950" />
                <Avatar initials="IC" className="size-10 bg-amber-200 text-amber-950" />
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {componentGroups.map((group) => (
                <div key={group.path} className="rounded-lg bg-white/10 p-4 dark:bg-olive-950/5">
                  <p className="text-3xl/8 font-semibold">{group.count}</p>
                  <p className="mt-1 text-sm/6 text-white/70 dark:text-olive-700">{group.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {['Palette', 'Spacing', 'Typography'].map((item) => (
              <div key={item} className="rounded-lg border border-olive-950/10 bg-white p-4 dark:border-white/10 dark:bg-olive-950">
                <p className="text-sm/6 font-medium">{item}</p>
                <p className="mt-1 text-xs/5 text-olive-600 dark:text-olive-400">Token driven</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="components" className="border-y border-olive-950/10 bg-white/65 py-14 dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Subheading>Component inventory</Subheading>
              <Heading className="mt-2">What is already organized</Heading>
            </div>
            <Text className="max-w-xl">
              The root component folder is grouped by usage: primitives for app surfaces, elements for page building,
              sections for full templates, and icons for reusable visual language.
            </Text>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {componentGroups.map((group) => (
              <article key={group.path} className="rounded-lg border border-olive-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-olive-950">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm/6 font-semibold">{group.name}</p>
                    <p className="mt-1 font-mono text-xs/5 text-olive-600 dark:text-olive-400">{group.path}</p>
                  </div>
                  <Badge color={group.status === 'Ready' ? 'emerald' : group.status === 'Templates' ? 'amber' : 'sky'}>
                    {group.status}
                  </Badge>
                </div>
                <p className="mt-5 text-4xl/10 font-semibold">{group.count}</p>
                <p className="mt-3 text-sm/6 text-olive-700 dark:text-olive-300">{group.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="preview" className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <div>
          <Subheading>Primitive preview</Subheading>
          <Heading className="mt-2">A few basic components in one place</Heading>
          <Text className="mt-4">
            This sample intentionally uses only local primitives so developers can see the default interaction states,
            border treatment, typography, form controls, and data table styling without opening every file.
          </Text>

          <div className="mt-8 flex flex-wrap gap-2">
            {primitiveSamples.map((sample) => (
              <Badge key={sample} color="zinc">
                {sample}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-olive-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Heading level={3}>Launch checklist</Heading>
              <Text className="mt-1">A compact form and table using the UI primitives.</Text>
            </div>
            <Badge color="emerald">Live sample</Badge>
          </div>

          <Divider className="my-5" soft />

          <Fieldset>
            <Legend>Page scaffold</Legend>
            <Field className="mt-5">
              <Label>Project name</Label>
              <Input defaultValue="Component showcase" />
            </Field>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field>
                <Label>Starting template</Label>
                <Select defaultValue="home">
                  <option value="home">Home landing</option>
                  <option value="pricing">Pricing page</option>
                  <option value="about">About page</option>
                </Select>
              </Field>
              <Field>
                <Label>Status</Label>
                <Select defaultValue="ready">
                  <option value="ready">Ready to reuse</option>
                  <option value="review">Needs review</option>
                  <option value="draft">Draft</option>
                </Select>
              </Field>
            </div>
            <Field className="mt-5">
              <Label>Developer note</Label>
              <Textarea
                defaultValue="Use components/ui for app primitives and components/sections for page-level examples."
                rows={3}
                resizable={false}
              />
            </Field>
            <CheckboxField className="mt-5">
              <Checkbox defaultChecked color="emerald" />
              <Label>Show this page as the repo entry point</Label>
              <Description>Useful while the team evaluates available building blocks.</Description>
            </CheckboxField>
          </Fieldset>

          <div className="mt-8">
            <Table dense striped>
              <TableHead>
                <TableRow>
                  <TableHeader>Primitive</TableHeader>
                  <TableHeader>Use</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ['Button', 'Primary actions and links', 'Ready'],
                  ['Input', 'Forms and filters', 'Ready'],
                  ['Table', 'Dense data previews', 'Ready'],
                ].map(([name, use, status]) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{use}</TableCell>
                    <TableCell>
                      <Badge color="emerald">{status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section id="templates" className="bg-olive-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <Badge color="amber">Template routes</Badge>
            <h2 className="mt-5 font-display text-4xl/12 text-balance sm:text-5xl/14">Pages the repo already knows how to compose.</h2>
            <p className="mt-5 text-base/7 text-olive-200">
              These Pages Router examples remain available as reference material. Use them as a source for section
              combinations, copy density, and page structure while the App Router landing page stays simple.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {templateRoutes.map((template) => (
                <button
                  key={template.route}
                  type="button"
                  onClick={() => setActiveTemplate(template)}
                  className="rounded-lg border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10 data-[active=true]:border-emerald-300 data-[active=true]:bg-emerald-300/10"
                  data-active={activeTemplate.route === template.route}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{template.label}</p>
                    <span className="font-mono text-xs/5 text-olive-300">{template.variants}</span>
                  </div>
                  <p className="mt-3 text-sm/6 text-olive-200">{template.description}</p>
                </button>
              ))}
            </div>

            <div className="rounded-lg border border-white/10 bg-white p-5 text-olive-950">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm/6 font-medium text-olive-600">Selected route</p>
                  <p className="mt-1 font-mono text-lg/7">{activeTemplate.route}</p>
                </div>
                <Button href={activeTemplate.route} color="dark">
                  Open example
                </Button>
              </div>
              <Divider className="my-5" soft />
              <p className="text-sm/6 text-olive-700">{activeTemplate.description}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
