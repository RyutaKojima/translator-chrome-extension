export class BaseOptionFailedError extends Error {}

export class InvalidTranslatorTypeError extends BaseOptionFailedError {
  constructor(message) {
    super(message) // 親クラスのコンストラクタを呼び出す

    this.name = 'InvalidTranslatorTypeError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidTranslatorTypeError) // スタックトレースをカスタマイズ
    }
  }
}

export class EmptyApiKeyError extends BaseOptionFailedError {
  constructor(message) {
    super(message) // 親クラスのコンストラクタを呼び出す

    this.name = 'EmptyApiKeyError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmptyApiKeyError) // スタックトレースをカスタマイズ
    }
  }
}
