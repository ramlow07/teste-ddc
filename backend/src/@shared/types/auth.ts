import { ApiResponse } from '../graphql/types'

export type TokenData = {
  sub: string // User ID
  data: any // Additional user data from JWT
  iat?: number // Issued at
  exp?: number // Expires at
}

export interface ExecutionDTOType<A, B, C = any> {
  tokenData: TokenData
  datap: A
  method: B
  error?: { error: ApiResponse }
  customData: C
}

export interface MethodType<T, Y> {
  rules: { [key: string]: (data: T) => Promise<T> }
  execution: (data: T) => Promise<Y>
}

export async function genericCaller<T>(context: any, data: any, method: string): Promise<T> {
  // console.log('genericCaller chamado - method:', method, 'data:', data);

  try {
    const result = await this.service.execute({
      datap: data,
      method,
      tokenData: context?.req?.tokenData,
      customData: {},
      error: undefined,
    });
    // console.log('Resultado do Service:', result);
    return result;
  } catch (error) {
    console.log(error)
    return { error: { internalServerError: 'Erro de servidor, tente novamente em alguns minutos' } } as any
  }
}
