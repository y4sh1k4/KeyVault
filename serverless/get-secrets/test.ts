import { handler } from './handler';

async function test() {
  const event = {
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzczODA5Mzg5LCJleHAiOjE3NzM4MTAyODl9.5puHXNEzyQypQZjzre_zvbNrKPfhW6ADmCwSbzExiEQ'
    }
  };

  const result = await handler(event as any, {} as any, () => {});
  console.log(result);
}

test();