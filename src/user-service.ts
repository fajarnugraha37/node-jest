import { Database } from "./db";
import { userUtils } from "./utils";

export class UserService {
  constructor(
    private db: Database = new Database(),
    private utils = userUtils
  ) {}

  async getFormattedUser(id: string): Promise<{ id: string; name: string }> {
    const user = await this.db.getUser(id);
    return { id: user.id, name: this.utils.formatName(user.name) };
  }

  async createUser(id: string, name: string): Promise<void> {
    const formattedName = this.utils.formatName(name);
    await this.db.saveUser({ id, name: formattedName });
  }
}
