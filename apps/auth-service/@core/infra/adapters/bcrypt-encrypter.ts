import bcrypt from 'bcrypt';

import { Encrypter } from '@core/application/ports/encrypter';

export class BcryptEncrypter extends Encrypter {
  public async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, 12);
  }

  public async compare(plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest);
  }
}
