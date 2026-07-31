/**
 * HTTP com suporte a proxy corporativo, usando apenas modulos nativos do Node.
 *
 * Existe porque o fetch nativo do Node nao respeita HTTP_PROXY/HTTPS_PROXY
 * (diferente do curl), e adicionar um pacote significaria instalar e manter
 * dependencia em cada repo do harness, alem de aparecer no scan do Mend.
 */

import http from 'node:http';
import https from 'node:https';
import tls from 'node:tls';

export const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export function getProxyUrl() {
  return (
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy ||
    null
  );
}

function requestThroughProxy(targetUrl, proxyUrlStr, accept) {
  return new Promise((resolve, reject) => {
    const target = new URL(targetUrl);
    const proxy = new URL(proxyUrlStr);

    const connectReq = http.request({
      host: proxy.hostname,
      port: proxy.port || 80,
      method: 'CONNECT',
      path: `${target.hostname}:${target.port || 443}`,
      headers: { Host: `${target.hostname}:${target.port || 443}` },
      timeout: 20000,
    });

    connectReq.on('connect', (proxyRes, socket) => {
      if (proxyRes.statusCode !== 200) {
        socket.destroy();
        reject(new Error(`Proxy recusou o tunel CONNECT: HTTP ${proxyRes.statusCode}`));
        return;
      }

      const tlsSocket = tls.connect({ socket, servername: target.hostname }, () => {
        const req = https.request(
          {
            method: 'GET',
            hostname: target.hostname,
            path: target.pathname + target.search,
            headers: { Host: target.hostname, 'User-Agent': USER_AGENT, Accept: accept },
            createConnection: () => tlsSocket,
          },
          (response) => {
            const chunks = [];
            response.on('data', (c) => chunks.push(c));
            response.on('end', () =>
              resolve({
                status: response.statusCode,
                contentType: response.headers['content-type'] || '',
                body: Buffer.concat(chunks).toString('utf-8'),
              })
            );
            response.on('error', reject);
          }
        );
        req.on('error', reject);
        req.end();
      });
      tlsSocket.on('error', reject);
    });

    connectReq.on('timeout', () => connectReq.destroy(new Error('Timeout ao conectar no proxy')));
    connectReq.on('error', reject);
    connectReq.end();
  });
}

/**
 * Retorna { status, contentType, body } — nunca lanca por status != 200,
 * porque o probe precisa distinguir 404 de erro de rede.
 */
export async function fetchRaw(url, accept = '*/*') {
  const proxyUrl = getProxyUrl();
  if (proxyUrl) {
    return requestThroughProxy(url, proxyUrl, accept);
  }
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: accept } });
  return {
    status: res.status,
    contentType: res.headers.get('content-type') || '',
    body: await res.text(),
  };
}

export async function fetchText(url, accept = '*/*') {
  const res = await fetchRaw(url, accept);
  if (res.status !== 200) throw new Error(`Falha ao buscar ${url}: ${res.status}`);
  return res.body;
}