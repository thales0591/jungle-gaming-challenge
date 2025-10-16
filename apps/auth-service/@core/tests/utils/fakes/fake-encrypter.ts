import { Encrypter } from '@core/application/ports/encrypter';

export class FakeEncrypter implements Encrypter {
  async hash(plaintext: string): Promise<string> {
    return plaintext.concat('-hashed');
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    return plaintext.concat('-hashed') === digest;
  }
}
