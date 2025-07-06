export class Database {
  async getUser(id: string): Promise<{ id: string; name: string }> {
    // Simulate database query
    return { id, name: `User ${id}` };
  }

  async saveUser(user: { id: string; name: string }): Promise<void> {
    // Simulate saving to database
    console.log(`Saving user ${user.name} to database`);
  }
}
