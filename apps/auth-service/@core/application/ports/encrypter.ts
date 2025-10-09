export abstract class Encrypter {
  abstract hash(plaintext: string): Promise<string>;
  abstract compare(plaintext: string, digest: string): Promise<boolean>;
}
