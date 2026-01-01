import { redirect } from 'next/navigation'

/**
 * Home Page
 *
 * Redirects to the job search page.
 * This will be replaced with a landing page in the future.
 */
export default function Home(): never {
  redirect('/jobs/search')
}
