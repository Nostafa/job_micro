import { ClientRMQ, RmqRecordBuilder } from '@nestjs/microservices';
import { THeaders } from '../types';
import { catchException } from '../utils';

export function sendMessagePipeException<T>({
  client,
  pattern,
  data,
  headers,
}: {
  client: ClientRMQ;
  pattern: any;
  data?: T;
  headers?: THeaders;
}) {
  const record = new RmqRecordBuilder()
    .setData(data ?? {})
    .setOptions({
      headers: headers,
    })
    .build();
  return client.send(pattern, record).pipe(catchException());
}
