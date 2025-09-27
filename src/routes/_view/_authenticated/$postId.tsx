import { sleep } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';

function RouteComponent() {
  const data = Route.useLoaderData();
  return <div>Hello {data}</div>;
}

export const Route = createFileRoute('/_view/_authenticated/$postId')({
  component: RouteComponent,
  loader: async ({ params: { postId } }) => {
    await sleep(3000);
    return `post detail ${postId}`;
  },
  pendingComponent: () => <div>loading...</div>,
});
