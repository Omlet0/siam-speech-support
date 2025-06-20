
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Eye, Settings } from "lucide-react";

interface VM {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  ram: number;
  disk: number;
  uptime: string;
  lastUpdate: string;
  analysisResult?: any;
}

interface VMTableViewProps {
  vms: VM[];
  onViewDetails: (vm: VM) => void;
  onManageVM: (vm: VM) => void;
}

export const VMTableView = ({ vms, onViewDetails, onManageVM }: VMTableViewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 10;

  // Filter VMs based on search and status
  const filteredVMs = vms.filter(vm => {
    const matchesSearch = vm.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vm.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredVMs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVMs = filteredVMs.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const getProgressColor = (value: number, status: string) => {
    if (status === 'critical' && value > 85) return 'bg-red-500';
    if (status === 'warning' && value > 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle>Virtual Machines ({filteredVMs.length})</CardTitle>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search VMs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>VM Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>Disk</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVMs.map((vm) => (
                <TableRow key={vm.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{vm.name}</TableCell>
                  <TableCell>{getStatusBadge(vm.status)}</TableCell>
                  <TableCell>
                    <div className="w-16">
                      <div className="text-xs mb-1">{vm.cpu.toFixed(1)}%</div>
                      <Progress value={vm.cpu} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-16">
                      <div className="text-xs mb-1">{vm.ram.toFixed(1)}%</div>
                      <Progress value={vm.ram} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-16">
                      <div className="text-xs mb-1">{vm.disk.toFixed(1)}%</div>
                      <Progress value={vm.disk} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {vm.analysisResult ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        {vm.analysisResult.score}/100
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {vm.uptime}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(vm)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onManageVM(vm)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            <div className="text-sm text-muted-foreground text-center mt-2">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredVMs.length)} of {filteredVMs.length} VMs
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
