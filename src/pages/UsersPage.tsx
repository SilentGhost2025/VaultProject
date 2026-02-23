import { useState, useEffect } from "react";
import { api, getLastServiceCall } from "@/lib/api";
import { User } from "@/lib/mockData";
import { UserCard } from "@/components/UserCard";
import { ServiceDiscoveryPanel } from "@/components/ServiceDiscoveryPanel";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [serviceLogs, setServiceLogs] = useState<any[]>([]);

  useEffect(() => {
    api.getUsers().then(setUsers);
  }, []);

  const handleServiceCall = (log: any) => {
    if (log) setServiceLogs((prev) => [log, ...prev].slice(0, 10));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Profiles</h1>
        <p className="text-sm text-muted-foreground">
          Click "Get Personalized Quote" to see inter-service communication via OpenFeign
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user, i) => (
          <UserCard key={user.id} user={user} index={i} onServiceCall={handleServiceCall} />
        ))}
      </div>

      <ServiceDiscoveryPanel logs={serviceLogs} />
    </div>
  );
}
