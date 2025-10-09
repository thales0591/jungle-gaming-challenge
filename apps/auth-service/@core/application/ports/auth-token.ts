export type GenerateTokenProps<Payload> = {
  secret: string;
  expiresAt?: Date;
  payload: Payload;
};

export type ValidateTokenProps = {
  token: string;
  secret: string;
};

export abstract class AuthToken {
  public abstract generate<Payload>(
    props: GenerateTokenProps<Payload>,
  ): Promise<string>;

  public abstract validate<Payload>(
    props: ValidateTokenProps,
  ): Promise<Payload>;
}
