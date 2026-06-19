import { Result } from "../base"
import Metadata from "../base/metadata"
import EncryptedPassword from "./encrypted-password.vo"

export default class HashPassword extends EncryptedPassword {
	static override create(value?: string, meta?: Metadata): HashPassword {
		return new HashPassword(value, meta)
	}

	static override tryCreate(value?: string, meta?: Metadata): Result<HashPassword> {
		return Result.try(() => new HashPassword(value, meta))
	}
}

export { HashPassword }
